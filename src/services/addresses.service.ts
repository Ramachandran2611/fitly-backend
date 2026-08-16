import * as addressesRepository from "../repositories/addresses.repository";
import { ForbiddenError, NotFoundError } from "../errors";

export async function createAddress(
  userId: number,
  line1: string,
  city: string,
  state: string,
  pincode: string,
  phone: string
) {
  return addressesRepository.insertAddress(userId, line1, city, state, pincode, phone);
}

export async function listAddresses(userId: number) {
  return addressesRepository.findAddressesByUser(userId);
}

export async function assertAddressOwnedByUser(addressId: string, userId: number) {
  const address = await addressesRepository.findAddressById(addressId);
  if (!address) {
    throw new NotFoundError("Address not found");
  }
  if (address.user_id !== userId) {
    throw new ForbiddenError("This address does not belong to you");
  }
  return address;
}
