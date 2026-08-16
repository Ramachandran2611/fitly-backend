import { FastifyRequest, FastifyReply } from "fastify";
import * as cartService from "../services/cart.service";

export async function addToCart(request: FastifyRequest, reply: FastifyReply) {
  const { productId, quantity } = request.body as {
    productId: string;
    quantity: number;
  };
  const item = await cartService.addToCart(request.user.id, productId, quantity);
  reply.code(201);
  return item;
}

export async function getCart(request: FastifyRequest, reply: FastifyReply) {
  return cartService.getCart(request.user.id);
}

export async function updateCartItem(request: FastifyRequest, reply: FastifyReply) {
  const { productId } = request.params as { productId: string };
  const { quantity } = request.body as { quantity: number };
  return cartService.updateCartItemQuantity(request.user.id, productId, quantity);
}

export async function removeCartItem(request: FastifyRequest, reply: FastifyReply) {
  const { productId } = request.params as { productId: string };
  await cartService.removeFromCart(request.user.id, productId);
  reply.code(204);
}
