import { pool } from "../db";

export async function upsertPayment(
  orderId: string,
  status: string,
  method: string,
  mockTransactionId: string
) {
  const result = await pool.query(
    `INSERT INTO payments (order_id, status, method, mock_transaction_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (order_id) DO UPDATE SET status = $2, mock_transaction_id = $4
     RETURNING *`,
    [orderId, status, method, mockTransactionId]
  );
  return result.rows[0];
}

export async function findPaymentByOrder(orderId: string) {
  const result = await pool.query("SELECT * FROM payments WHERE order_id = $1", [orderId]);
  return result.rows[0] ?? null;
}

export async function updatePaymentStatus(orderId: string, status: string) {
  const result = await pool.query(
    "UPDATE payments SET status = $1 WHERE order_id = $2 RETURNING *",
    [status, orderId]
  );
  return result.rows[0] ?? null;
}
