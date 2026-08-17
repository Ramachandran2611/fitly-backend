import { FastifyInstance } from "fastify";
import * as addressesController from "../controllers/addresses.controller";

const createAddressSchema = {
  tags: ["Addresses"],
  summary: "Add a shipping address",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["line1", "city", "state", "pincode", "phone"],
    properties: {
      line1: { type: "string", minLength: 1 },
      city: { type: "string", minLength: 1 },
      state: { type: "string", minLength: 1 },
      pincode: { type: "string", minLength: 1 },
      phone: { type: "string", minLength: 1 },
    },
  },
};

const listAddressesSchema = {
  tags: ["Addresses"],
  summary: "List the current user's addresses",
  security: [{ bearerAuth: [] }],
};

export default async function addressesRoutes(app: FastifyInstance) {
  app.post(
    "/addresses",
    { schema: createAddressSchema, preHandler: app.authenticate },
    addressesController.createAddress
  );

  app.get(
    "/addresses",
    { schema: listAddressesSchema, preHandler: app.authenticate },
    addressesController.listAddresses
  );
}
