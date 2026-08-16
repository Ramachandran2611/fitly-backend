import { FastifyRequest, FastifyReply } from "fastify";
import * as productsService from "../services/products.service";

export async function listProducts(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as {
    search?: string;
    category?: string;
    brand?: string;
    veg?: boolean;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  };
  return productsService.listProducts(query);
}

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  return productsService.getProduct(id);
}

export async function listCategories(request: FastifyRequest, reply: FastifyReply) {
  return productsService.listCategories();
}
