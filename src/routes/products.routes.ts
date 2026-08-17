import { FastifyInstance } from "fastify";
import * as productsController from "../controllers/products.controller";

const listProductsSchema = {
  tags: ["Products"],
  summary: "List products, with optional search/filter/sort",
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
  tags: ["Products"],
  summary: "Get a single product by id",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", pattern: "^[0-9]+$" },
    },
  },
};

const listCategoriesSchema = {
  tags: ["Products"],
  summary: "List categories",
};

export default async function productsRoutes(app: FastifyInstance) {
  app.get("/products", { schema: listProductsSchema }, productsController.listProducts);
  app.get("/products/:id", { schema: idParamSchema }, productsController.getProduct);
  app.get("/categories", { schema: listCategoriesSchema }, productsController.listCategories);
}
