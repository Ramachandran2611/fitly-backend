import { pool } from "../db";

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  veg?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

const SORT_OPTIONS: Record<string, string> = {
  price_asc: "COALESCE(p.discount_price, p.price) ASC",
  price_desc: "COALESCE(p.discount_price, p.price) DESC",
  rating: "p.rating_avg DESC",
  newest: "p.created_at DESC",
  name_asc: "p.name ASC",
  name_desc: "p.name DESC",
};

export async function findAllProducts(filters: ProductFilters) {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`p.name ILIKE $${params.length}`);
  }
  if (filters.category) {
    params.push(filters.category);
    conditions.push(`c.slug = $${params.length}`);
  }
  if (filters.brand) {
    params.push(filters.brand);
    conditions.push(`p.brand = $${params.length}`);
  }
  if (filters.veg !== undefined) {
    params.push(filters.veg);
    conditions.push(`p.is_veg = $${params.length}`);
  }
  if (filters.inStock !== undefined) {
    conditions.push(filters.inStock ? `p.stock_quantity > 0` : `p.stock_quantity = 0`);
  }
  if (filters.minPrice !== undefined) {
    params.push(filters.minPrice);
    conditions.push(`COALESCE(p.discount_price, p.price) >= $${params.length}`);
  }
  if (filters.maxPrice !== undefined) {
    params.push(filters.maxPrice);
    conditions.push(`COALESCE(p.discount_price, p.price) <= $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause = SORT_OPTIONS[filters.sort ?? ""] ?? SORT_OPTIONS.newest;

  const result = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     ${whereClause}
     ORDER BY ${orderClause}`,
    params
  );
  return result.rows;
}

export async function findProductById(id: string) {
  const result = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function findAllCategories() {
  const result = await pool.query("SELECT id, name, slug FROM categories ORDER BY name");
  return result.rows;
}
