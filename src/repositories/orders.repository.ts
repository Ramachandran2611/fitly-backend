import { Pool, PoolClient } from "pg";
import { pool } from "../db";

export async function insertOrder(
  client: Pool | PoolClient,
  userId: number,
  addressId: string,
  totalAmount: number
) {
  const result = await client.query(
    `INSERT INTO orders (user_id, address_id, total_amount, status)
     VALUES ($1, $2, $3, 'pending') RETURNING *`,
    [userId, addressId, totalAmount]
  );
  return result.rows[0];
}

export async function insertOrderItem(
  client: Pool | PoolClient,
  orderId: number,
  productId: number,
  quantity: number,
  priceAtPurchase: number
) {
  await client.query(
    `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
     VALUES ($1, $2, $3, $4)`,
    [orderId, productId, quantity, priceAtPurchase]
  );
}

export async function findOrderById(id: string) {
  const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function findOrdersByUser(userId: number) {
  const result = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

export async function findOrderItems(orderId: string) {
  const result = await pool.query(
    `SELECT oi.product_id, oi.quantity, oi.price_at_purchase, p.name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  return result.rows;
}

export async function updateOrderStatus(id: string, status: string) {
  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0] ?? null;
}
