import server$, { createServerData$ } from "solid-start/server";
import { prisma } from "~/server/db/client";
import type { prismaType } from "~/types";
import { getProducts$ } from "./ProductServices";

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

// Create Cart Item Server Function
export const createCartItem$ = server$(async (productId: string) => {
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
});

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

// Create Cart Item Raw Server Function
export const createCartItemRaw$ = server$(async (productId: string) => {
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
});

// READ

// get CartItems
export const getCartItems = async (prisma: prismaType) => {
	const cartItems = await prisma.cartItem.findMany({
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItems;
};

// get CartItems Server Function
export const getCartItems$ = server$(async () => {
	const cartItems = await prisma.cartItem.findMany({
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItems;
});

// get CartItems Raw
export const getCartItemsRaw = async (prisma: prismaType) => {
	const cartItems = await prisma.cartItem.findMany();

	return cartItems;
};

// get CartItems Raw Server Function
export const getCartItemsRaw$ = server$(async () => {
	const cartItems = await prisma.cartItem.findMany();

	return cartItems;
});

// get CartItems with Server Data Server Function
export const getServerCartItemsData$ = () =>
	createServerData$(
		async () => {
			const cartItems = await prisma.cartItem.findMany({
				select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
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
			const cartItems = await prisma.cartItem.findMany();

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

// get CartItem Server Function
export const getCartItem$ = server$(async (cartId: string) => {
	const cartItem = await prisma.cartItem.findUnique({
		where: { id: cartId },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItem;
});

// get CartItem by Product Id
export const getCartItemByProductId = async (prisma: prismaType, productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({
		where: { productId },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItem;
};

// get CartItem by Product Id Server Function
export const getCartItemByProductId$ = server$(async (productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({
		where: { productId },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItem;
});

// get CartItem Raw
export const getCartItemRaw = async (prisma: prismaType, cartId: string) => {
	const cartItem = await prisma.cartItem.findUnique({ where: { id: cartId } });

	return cartItem;
};

// get CartItem Raw Server Function
export const getCartItemRaw$ = server$(async (cartId: string) => {
	const cartItem = await prisma.cartItem.findUnique({ where: { id: cartId } });

	return cartItem;
});

// get CartItem by Product Id
export const getCartItemByProductIdRaw = async (prisma: prismaType, productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({ where: { productId } });

	return cartItem;
};

// get CartItem by Product Id Server Function
export const getCartItemByProductIdRaw$ = server$(async (productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({ where: { productId } });

	return cartItem;
});

// get Cart Total Price
export const getTotalPrice = async (prisma: prismaType) => {
	const products = await getProducts$();
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

// get Cart Total Price Server Function
export const getTotalPrice$ = server$(async () => {
	const products = await getProducts$();
	const cartItems = await getCartItems$();

	return (
		cartItems?.reduce(
			(totalPrice, cartItem) =>
				cartItem.quantity *
					Number(products?.find((item) => item.id === cartItem.productId)?.price || 0) +
				totalPrice,
			0
		) || 0
	);
});

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

// Increase Cart Item Quantit Servery Function
export const increaseCartItem$ = server$(async (cartId: string) => {
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
});

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

// Increase Cart Item Quantity R Serveraw Function
export const increaseCartItemRaw$ = server$(async (cartId: string) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: {
			quantity: {
				increment: 1,
			},
			updatedAt: new Date(),
		},
	});
});

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

// Decrease Cart Item Quantit Servery Function
export const decreaseCartItem$ = server$(async (cartId: string) => {
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
});

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

// Decrease Cart Item Quantity R Serveraw Function
export const decreaseCartItemRaw$ = server$(async (cartId: string) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: {
			quantity: {
				decrement: 1,
			},
			updatedAt: new Date(),
		},
	});
});

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

// set Cart Item Quantity Server Function
export const setCartItemQuantity$ = server$(async (cartId: string, newQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: newQuantity, updatedAt: new Date() },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
});

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

// set Cart Item Quantity Raw Server Function
export const setCartItemQuantityRaw$ = server$(async (cartId: string, newQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: newQuantity, updatedAt: new Date() },
	});
});

// DELETE

// delete Cart Item
export const removeCartItem = async (prisma: prismaType, cartId: string) => {
	return await prisma.cartItem.delete({
		where: { id: cartId },
	});
};

// delete Cart Item Server Function
export const removeCartItem$ = server$(async (cartId: string) => {
	return await prisma.cartItem.delete({
		where: { id: cartId },
	});
});

// delete Cart Item
export const removeCartItems = async (prisma: prismaType) => {
	await prisma.cartItem.deleteMany();
};

// delete Cart Item Server Function
export const removeCartItems$ = server$(async () => {
	await prisma.cartItem.deleteMany();
});
