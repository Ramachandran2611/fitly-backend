import { FastifyInstance } from "fastify";
import * as ordersController from "../controllers/orders.controller";

const checkoutSchema = {
  tags: ["Orders"],
  summary: "Checkout the current cart into a new order",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["addressId"],
    properties: {
      addressId: { type: "string", pattern: "^[0-9]+$" },
    },
  },
};

const listOrdersSchema = {
  tags: ["Orders"],
  summary: "List the current user's orders",
  security: [{ bearerAuth: [] }],
};

const idParamSchema = {
  tags: ["Orders"],
  summary: "Get a single order by id",
  security: [{ bearerAuth: [] }],
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
  summary: "Pay for an order (mocked payment)",
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

  app.get(
    "/orders",
    { schema: listOrdersSchema, preHandler: app.authenticate },
    ordersController.listOrders
  );

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
    { schema: { ...idParamSchema, summary: "Cancel a pending order" }, preHandler: app.authenticate },
    ordersController.cancelOrder
  );

  app.post(
    "/orders/:id/mark-delivered",
    {
      schema: { ...idParamSchema, summary: "Mark a paid order as delivered" },
      preHandler: app.authenticate,
    },
    ordersController.markDelivered
  );

  app.post(
    "/orders/:id/return",
    { schema: { ...idParamSchema, summary: "Return a delivered order" }, preHandler: app.authenticate },
    ordersController.returnOrder
  );

  app.post(
    "/orders/:id/refund",
    {
      schema: { ...idParamSchema, summary: "Refund a returned/cancelled order" },
      preHandler: app.authenticate,
    },
    ordersController.refundOrder
  );
}
