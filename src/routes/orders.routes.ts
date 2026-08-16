import { FastifyInstance } from "fastify";
import * as ordersController from "../controllers/orders.controller";

const checkoutSchema = {
  body: {
    type: "object",
    required: ["addressId"],
    properties: {
      addressId: { type: "string", pattern: "^[0-9]+$" },
    },
  },
};

const idParamSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", pattern: "^[0-9]+$" },
    },
  },
};

const paySchema = {
  ...idParamSchema,
  body: {
    type: "object",
    properties: {
      simulateFailure: { type: "boolean" },
    },
  },
};

export default async function ordersRoutes(app: FastifyInstance) {
  app.post(
    "/checkout",
    { schema: checkoutSchema, preHandler: app.authenticate },
    ordersController.checkout
  );

  app.get("/orders", { preHandler: app.authenticate }, ordersController.listOrders);

  app.get(
    "/orders/:id",
    { schema: idParamSchema, preHandler: app.authenticate },
    ordersController.getOrder
  );

  app.post(
    "/orders/:id/pay",
    { schema: paySchema, preHandler: app.authenticate },
    ordersController.payOrder
  );

  app.post(
    "/orders/:id/cancel",
    { schema: idParamSchema, preHandler: app.authenticate },
    ordersController.cancelOrder
  );

  app.post(
    "/orders/:id/mark-delivered",
    { schema: idParamSchema, preHandler: app.authenticate },
    ordersController.markDelivered
  );

  app.post(
    "/orders/:id/return",
    { schema: idParamSchema, preHandler: app.authenticate },
    ordersController.returnOrder
  );

  app.post(
    "/orders/:id/refund",
    { schema: idParamSchema, preHandler: app.authenticate },
    ordersController.refundOrder
  );
}
