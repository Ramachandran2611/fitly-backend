import { FastifyInstance } from "fastify";
import * as addressesController from "../controllers/addresses.controller";

const createAddressSchema = {
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

export default async function addressesRoutes(app: FastifyInstance) {
  app.post(
    "/addresses",
    { schema: createAddressSchema, preHandler: app.authenticate },
    addressesController.createAddress
  );

  app.get("/addresses", { preHandler: app.authenticate }, addressesController.listAddresses);
}
