import { pool } from "../db";
import * as ordersRepository from "../repositories/orders.repository";
import * as cartRepository from "../repositories/cart.repository";
import * as paymentsRepository from "../repositories/payments.repository";
import * as addressesService from "./addresses.service";
import { NotFoundError, ForbiddenError, ConflictError } from "../errors";

// Which status an order can move to, from its current status.
// "shipped" is intentionally left out for now -- there's no real
// logistics integration yet, so paid orders go straight to delivered
// via the markDelivered stand-in below.
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["delivered", "cancelled"],
  delivered: ["returned"],
  returned: ["refunded"],
  cancelled: ["refunded"],
};

function assertTransitionAllowed(currentStatus: string, nextStatus: string) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new ConflictError(
      `Cannot move order from '${currentStatus}' to '${nextStatus}'`
    );
  }
}

async function getOrderWithOwnership(orderId: string, userId: number) {
  const order = await ordersRepository.findOrderById(orderId);
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  if (order.user_id !== userId) {
    throw new ForbiddenError("This order does not belong to you");
  }
  return order;
}

export async function checkout(userId: number, addressId: string) {
  await addressesService.assertAddressOwnedByUser(addressId, userId);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const cartItems = await cartRepository.findCartByUser(userId, client);
    if (cartItems.length === 0) {
      throw new ConflictError("Cart is empty");
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      const unitPrice = Number(item.discount_price ?? item.price);
      return sum + unitPrice * item.quantity;
    }, 0);

    const order = await ordersRepository.insertOrder(client, userId, addressId, totalAmount);

    for (const item of cartItems) {
      const unitPrice = Number(item.discount_price ?? item.price);
      await ordersRepository.insertOrderItem(
        client,
        order.id,
        item.product_id,
        item.quantity,
        unitPrice
      );
    }

    await cartRepository.clearCart(userId, client);

    await client.query("COMMIT");
    return getOrder(order.id, userId);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getOrder(orderId: number | string, userId: number) {
  const order = await getOrderWithOwnership(String(orderId), userId);
  const items = await ordersRepository.findOrderItems(String(orderId));
  const payment = await paymentsRepository.findPaymentByOrder(String(orderId));
  return { ...order, items, payment };
}

export async function listOrders(userId: number) {
  return ordersRepository.findOrdersByUser(userId);
}

export async function payOrder(
  orderId: string,
  userId: number,
  simulateFailure: boolean
) {
  const order = await getOrderWithOwnership(orderId, userId);
  assertTransitionAllowed(order.status, "paid");

  if (simulateFailure) {
    await paymentsRepository.upsertPayment(orderId, "failed", "mock", `mock_${Date.now()}`);
    throw new ConflictError("Payment failed (simulated)");
  }

  const mockTransactionId = `mock_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  await paymentsRepository.upsertPayment(orderId, "success", "mock", mockTransactionId);
  return ordersRepository.updateOrderStatus(orderId, "paid");
}

export async function cancelOrder(orderId: string, userId: number) {
  const order = await getOrderWithOwnership(orderId, userId);
  assertTransitionAllowed(order.status, "cancelled");
  return ordersRepository.updateOrderStatus(orderId, "cancelled");
}

// Stand-in for a real courier/logistics webhook, which doesn't exist yet.
// Lets the delivered -> returned -> refunded path actually be testable.
export async function markDelivered(orderId: string, userId: number) {
  const order = await getOrderWithOwnership(orderId, userId);
  assertTransitionAllowed(order.status, "delivered");
  return ordersRepository.updateOrderStatus(orderId, "delivered");
}

export async function returnOrder(orderId: string, userId: number) {
  const order = await getOrderWithOwnership(orderId, userId);
  assertTransitionAllowed(order.status, "returned");
  return ordersRepository.updateOrderStatus(orderId, "returned");
}

export async function refundOrder(orderId: string, userId: number) {
  const order = await getOrderWithOwnership(orderId, userId);
  assertTransitionAllowed(order.status, "refunded");
  await paymentsRepository.updatePaymentStatus(orderId, "refunded");
  return ordersRepository.updateOrderStatus(orderId, "refunded");
}
