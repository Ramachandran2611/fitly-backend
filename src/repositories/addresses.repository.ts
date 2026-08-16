import { pool } from "../db";

export async function insertAddress(
  userId: number,
  line1: string,
  city: string,
  state: string,
  pincode: string,
  phone: string
) {
  const result = await pool.query(
    `INSERT INTO addresses (user_id, line1, city, state, pincode, phone)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, line1, city, state, pincode, phone]
  );
  return result.rows[0];
}

export async function findAddressesByUser(userId: number) {
  const result = await pool.query(
    "SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

export async function findAddressById(id: string) {
  const result = await pool.query("SELECT * FROM addresses WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}
