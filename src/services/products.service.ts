import * as productsRepository from "../repositories/products.repository";
import { NotFoundError } from "../errors";
import { ProductFilters } from "../repositories/products.repository";

export async function listProducts(filters: ProductFilters) {
  return productsRepository.findAllProducts(filters);
}

export async function getProduct(id: string) {
  const product = await productsRepository.findProductById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  return product;
}

export async function listCategories() {
  return productsRepository.findAllCategories();
}
