import { FastifyInstance } from "fastify";
import { makeAuthController } from "../controllers/auth.controller";

const authBodySchema = {
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
};

export default async function authRoutes(app: FastifyInstance) {
  const controller = makeAuthController(app);

  app.post(
    "/auth/register",
    { schema: { ...authBodySchema, summary: "Create an account" } },
    controller.register
  );
  app.post(
    "/auth/login",
    { schema: { ...authBodySchema, summary: "Log in and receive a JWT" } },
    controller.login
  );
}
