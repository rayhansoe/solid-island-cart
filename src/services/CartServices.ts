import { createServerData$ } from "solid-start/server";
import type { prismaType } from "~/types";
import { getProducts } from "./ProductServices";
import { prisma } from "~/server/db/client";

// CREATE

// Create Cart Item
export const createCartItem = async (prisma: prismaType, productId: string) => {
	return await prisma.cartItem.create({
		data: {
			quantity: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
			productId,
			isChecked: true,
			status: true,
		},
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
};

// Create Cart Item Raw
export const createCartItemRaw = async (prisma: prismaType, productId: string) => {
	return await prisma.cartItem.create({
		data: {
			quantity: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
			productId,
			isChecked: true,
			status: true,
		},
	});
};

// READ

// get CartItems
export const getCartItems = async (prisma: prismaType) => {
	const cartItems = await prisma.cartItem.findMany({
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItems;
};

// get CartItems with Server Data Server Function
export const getServerCartItemsData$ = () =>
	createServerData$(
		async () => {
			const cartItems = await prisma.cartItem.findMany({
				select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
				orderBy: { createdAt: "asc" },
			});

			return cartItems;
		},
		{
			deferStream: true,
		}
	);

// get CartItems with Server Data Raw Server Function
export const getServerCartItemsDataRaw$ = () =>
	createServerData$(
		async () => {
			const cartItems = await getCartItems(prisma);

			return cartItems;
		},
		{
			deferStream: true,
		}
	);

// get CartItem
export const getCartItem = async (prisma: prismaType, cartId: string) => {
	const cartItem = await prisma.cartItem.findUnique({
		where: { id: cartId },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItem;
};

// get CartItem by Product Id
export const getCartItemByProductId = async (prisma: prismaType, productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({
		where: { productId },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItem;
};

// get CartItem Raw
export const getCartItemRaw = async (prisma: prismaType, cartId: string) => {
	const cartItem = await prisma.cartItem.findUnique({ where: { id: cartId } });

	return cartItem;
};

// get CartItem by Product Id
export const getCartItemByProductIdRaw = async (prisma: prismaType, productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({ where: { productId } });

	return cartItem;
};

// get Cart Total Price
export const getTotalPrice = async (prisma: prismaType) => {
	const products = await getProducts(prisma);
	const cartItems = await getCartItems(prisma);

	return (
		cartItems?.reduce(
			(totalPrice, cartItem) =>
				cartItem.quantity *
					Number(products?.find((item) => item.id === cartItem.productId)?.price || 0) +
				totalPrice,
			0
		) || 0
	);
};

// UPDATE

// Increase Cart Item Quantity
export const increaseCartItem = async (prisma: prismaType, cartId: string) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: {
			quantity: {
				increment: 1,
			},
			updatedAt: new Date(),
		},
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
};

// Increase Cart Item Quantity Raw
export const increaseCartItemRaw = async (
	prisma: prismaType,
	cartId: string,
	prevQuantity: number
) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: prevQuantity + 1, updatedAt: new Date() },
	});
};

// Decrease Cart Item Quantity
export const decreaseCartItem = async (prisma: prismaType, cartId: string) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: {
			quantity: {
				decrement: 1,
			},
			updatedAt: new Date(),
		},
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
};

// Decrease Cart Item Quantity Raw
export const decreaseCartItemRaw = async (
	prisma: prismaType,
	cartId: string,
	prevQuantity: number
) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: prevQuantity - 1, updatedAt: new Date() },
	});
};

// set Cart Item Quantity
export const setCartItemQuantity = async (
	prisma: prismaType,
	cartId: string,
	newQuantity: number
) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: newQuantity, updatedAt: new Date() },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
};

// set Cart Item Quantity Raw
export const setCartItemQuantityRaw = async (
	prisma: prismaType,
	cartId: string,
	newQuantity: number
) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: newQuantity, updatedAt: new Date() },
	});
};

// DELETE

// delete Cart Item
export const removeCartItem = async (prisma: prismaType, cartId: string) => {
	return await prisma.cartItem.delete({
		where: { id: cartId },
	});
};

// delete Cart Item
export const removeCartItems = async (prisma: prismaType) => {
	await prisma.cartItem.deleteMany();
};
