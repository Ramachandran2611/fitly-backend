import "dotenv/config";
import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { pool } from "./db";
import { registerAuthenticate } from "./middleware/authenticate";
import authRoutes from "./routes/auth.routes";
import productsRoutes from "./routes/products.routes";
import cartRoutes from "./routes/cart.routes";
import addressesRoutes from "./routes/addresses.routes";
import ordersRoutes from "./routes/orders.routes";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "./errors";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string };
    user: { id: number; email: string };
  }
}

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error("Missing required env var: JWT_SECRET and DATABASE_URL must both be set");
  process.exit(1);
}

const app = Fastify({ logger: true });
const port = Number(process.env.PORT) || 4000;
const apiBaseUrl = process.env.API_BASE_URL ?? `http://localhost:${port}`;

app.register(cors, {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
app.register(jwt, { secret: process.env.JWT_SECRET });
registerAuthenticate(app);

app.register(swagger, {
  openapi: {
    info: {
      title: "Fitly API",
      description: "REST API for the Fitly gym-supplements store",
      version: "1.0.0",
    },
    servers: [{ url: apiBaseUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Auth", description: "Registration and login" },
      { name: "Products", description: "Catalog browsing" },
      { name: "Cart", description: "Shopping cart" },
      { name: "Addresses", description: "Shipping addresses" },
      { name: "Orders", description: "Checkout and order lifecycle" },
    ],
  },
});
app.register(swaggerUi, { routePrefix: "/docs" });

app.get("/health", async (request, reply) => {
  return { status: "ok" };
});

app.get("/health/db", async (request, reply) => {
  const result = await pool.query("SELECT NOW()");
  return { status: "ok", serverTime: result.rows[0].now };
});

app.register(authRoutes);
app.register(productsRoutes);
app.register(cartRoutes);
app.register(addressesRoutes);
app.register(ordersRoutes);

app.setErrorHandler((error: FastifyError, request, reply) => {
  if (error.validation) {
    reply.code(422).send({ error: error.message });
    return;
  }
  if (error instanceof UnauthorizedError) {
    reply.code(401).send({ error: error.message });
    return;
  }
  if (error instanceof ForbiddenError) {
    reply.code(403).send({ error: error.message });
    return;
  }
  if (error instanceof NotFoundError) {
    reply.code(404).send({ error: error.message });
    return;
  }
  if (error instanceof ConflictError) {
    reply.code(409).send({ error: error.message });
    return;
  }
  if (error.statusCode && error.statusCode < 500) {
    reply.code(error.statusCode).send({ error: error.message });
    return;
  }

  request.log.error(error);
  reply.code(500).send({ error: "Internal Server Error" });
});

const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
