import { FastifyRequest, FastifyReply } from "fastify";
import * as addressesService from "../services/addresses.service";

export async function createAddress(request: FastifyRequest, reply: FastifyReply) {
  const { line1, city, state, pincode, phone } = request.body as {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  const address = await addressesService.createAddress(
    request.user.id,
    line1,
    city,
    state,
    pincode,
    phone
  );
  reply.code(201);
  return address;
}

export async function listAddresses(request: FastifyRequest, reply: FastifyReply) {
  return addressesService.listAddresses(request.user.id);
}
