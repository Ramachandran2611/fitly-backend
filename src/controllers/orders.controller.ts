import { FastifyRequest, FastifyReply } from "fastify";
import * as ordersService from "../services/orders.service";

export async function checkout(request: FastifyRequest, reply: FastifyReply) {
  const { addressId } = request.body as { addressId: string };
  const order = await ordersService.checkout(request.user.id, addressId);
  reply.code(201);
  return order;
}

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  return ordersService.getOrder(id, request.user.id);
}

export async function listOrders(request: FastifyRequest, reply: FastifyReply) {
  return ordersService.listOrders(request.user.id);
}

export async function payOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { simulateFailure } = request.body as { simulateFailure?: boolean };
  return ordersService.payOrder(id, request.user.id, simulateFailure ?? false);
}

export async function cancelOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  return ordersService.cancelOrder(id, request.user.id);
}

export async function markDelivered(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  return ordersService.markDelivered(id, request.user.id);
}

export async function returnOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  return ordersService.returnOrder(id, request.user.id);
}

export async function refundOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  return ordersService.refundOrder(id, request.user.id);
}
