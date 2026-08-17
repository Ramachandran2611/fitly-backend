import { FastifyInstance } from "fastify";
import * as cartController from "../controllers/cart.controller";

const addToCartSchema = {
  tags: ["Cart"],
  summary: "Add a product to the cart",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["productId", "quantity"],
    properties: {
      productId: { type: "string", pattern: "^[0-9]+$" },
      quantity: { type: "integer", minimum: 1 },
    },
  },
};

const getCartSchema = {
  tags: ["Cart"],
  summary: "Get the current user's cart",
  security: [{ bearerAuth: [] }],
};

const productIdParamSchema = {
  tags: ["Cart"],
  summary: "Remove a cart item",
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    required: ["productId"],
    properties: {
      productId: { type: "string", pattern: "^[0-9]+$" },
    },
  },
};

const updateQuantitySchema = {
  ...productIdParamSchema,
  summary: "Update a cart item's quantity",
  body: {
    type: "object",
    required: ["quantity"],
    properties: {
      quantity: { type: "integer", minimum: 1 },
    },
  },
};

export default async function cartRoutes(app: FastifyInstance) {
  app.post(
    "/cart",
    { schema: addToCartSchema, preHandler: app.authenticate },
    cartController.addToCart
  );

  app.get("/cart", { schema: getCartSchema, preHandler: app.authenticate }, cartController.getCart);

  app.patch(
    "/cart/:productId",
    { schema: updateQuantitySchema, preHandler: app.authenticate },
    cartController.updateCartItem
  );

  app.delete(
    "/cart/:productId",
    { schema: productIdParamSchema, preHandler: app.authenticate },
    cartController.removeCartItem
  );
}
