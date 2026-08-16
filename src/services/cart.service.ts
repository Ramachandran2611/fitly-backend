import * as cartRepository from "../repositories/cart.repository";
import { NotFoundError } from "../errors";

export async function addToCart(
  userId: number,
  productId: string,
  quantity: number
) {
  try {
    return await cartRepository.upsertCartItem(userId, productId, quantity);
  } catch (err: any) {
    if (err.code === "23503") {
      throw new NotFoundError("Product not found");
    }
    throw err;
  }
}

export async function getCart(userId: number) {
  const items = await cartRepository.findCartByUser(userId);
  const withSubtotals = items.map((item) => {
    const unitPrice = Number(item.discount_price ?? item.price);
    return { ...item, unitPrice, subtotal: unitPrice * item.quantity };
  });
  const total = withSubtotals.reduce((sum, item) => sum + item.subtotal, 0);
  return { items: withSubtotals, total };
}

export async function updateCartItemQuantity(
  userId: number,
  productId: string,
  quantity: number
) {
  const updated = await cartRepository.setCartItemQuantity(
    userId,
    productId,
    quantity
  );
  if (!updated) {
    throw new NotFoundError("Item not in cart");
  }
  return updated;
}

export async function removeFromCart(userId: number, productId: string) {
  const removed = await cartRepository.deleteCartItem(userId, productId);
  if (!removed) {
    throw new NotFoundError("Item not in cart");
  }
  return removed;
}
