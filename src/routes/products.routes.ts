import { FastifyInstance } from "fastify";
import * as productsController from "../controllers/products.controller";

const listProductsSchema = {
  querystring: {
    type: "object",
    properties: {
      search: { type: "string" },
      category: { type: "string" },
      brand: { type: "string" },
      veg: { type: "boolean" },
      inStock: { type: "boolean" },
      minPrice: { type: "number" },
      maxPrice: { type: "number" },
      sort: {
        type: "string",
        enum: ["price_asc", "price_desc", "rating", "newest", "name_asc", "name_desc"],
      },
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

export default async function productsRoutes(app: FastifyInstance) {
  app.get("/products", { schema: listProductsSchema }, productsController.listProducts);
  app.get("/products/:id", { schema: idParamSchema }, productsController.getProduct);
  app.get("/categories", productsController.listCategories);
}
