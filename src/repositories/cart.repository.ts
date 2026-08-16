import { Pool, PoolClient } from "pg";
import { pool } from "../db";

export async function upsertCartItem(
  userId: number,
  productId: string,
  quantity: number
) {
  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING *`,
    [userId, productId, quantity]
  );
  return result.rows[0];
}

export async function findCartByUser(
  userId: number,
  client: Pool | PoolClient = pool
) {
  const result = await client.query(
    `SELECT ci.product_id, ci.quantity, p.name, p.price, p.discount_price, p.image_url, p.stock_quantity
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1
     ORDER BY ci.created_at`,
    [userId]
  );
  return result.rows;
}

export async function clearCart(userId: number, client: Pool | PoolClient = pool) {
  await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
}

export async function setCartItemQuantity(
  userId: number,
  productId: string,
  quantity: number
) {
  const result = await pool.query(
    `UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
    [quantity, userId, productId]
  );
  return result.rows[0] ?? null;
}

export async function deleteCartItem(userId: number, productId: string) {
  const result = await pool.query(
    `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *`,
    [userId, productId]
  );
  return result.rows[0] ?? null;
}
