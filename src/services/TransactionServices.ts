import type { RouteDataArgs } from "solid-start";
import { createServerData$ } from "solid-start/server";
import type { prismaType } from "~/types";
import { prisma } from "~/server/db/client";
import { getCartItems, getTotalPrice } from "./CartServices";

type Params = RouteDataArgs["params"];

// CREATE

// Create Transaction
export const createTransaction = async (prisma: prismaType) => {
	const cartItems = await getCartItems(prisma);
	const totalPrice = await getTotalPrice(prisma);
	return await prisma.transaction.create({
		data: {
			quantities: cartItems.length,
			totalPrice,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
};

// Create Transaction Item
export const createTransactionItem = async (prisma: prismaType, transactionId: string) => {
	const cartItems = await getCartItems(prisma);

	const arrQuery = cartItems.map((item) =>
		prisma.transactionItem.create({
			data: {
				createdAt: new Date(),
				updatedAt: new Date(),
				quantity: item.quantity,
				productId: item.productId,
				transactionId,
			},
		})
	);

	return await prisma.$transaction(arrQuery);
};

// READ

// get Transactions
export const getTransactions = async (prisma: prismaType) => {
	return await prisma.transaction.findMany();
};

// get Transactions Server Resource
export const getServerTransactionsData$ = () =>
	createServerData$(
		async () => {
			return await prisma.transaction.findMany();
		},
		{
			deferStream: true,
		}
	);

// get Transaction
export const getTransaction = async (prisma: prismaType, transactionId: string) => {
	return await prisma.transaction.findUnique({
		where: {
			id: transactionId,
		},
	});
};

// get Transaction Server Resource
export const getServerTransactionData$ = (params: Params) =>
	createServerData$(
		async ([, id]) => {
			const response = await prisma.transaction.findUnique({ where: { id } });

			return response;
		},
		{ key: () => ["transaction", params.id], deferStream: true }
	);

// get Transaction Items
export const getTransactionsItems = async (prisma: prismaType) => {
	return await prisma.transactionItem.findMany();
};

// get Transaction Items Server Resource
export const getServerTransactionsItemsData$ = () =>
	createServerData$(
		async () => {
			return await prisma.transactionItem.findMany();
		},
		{ deferStream: true }
	);

// get Transaction Items
export const getTransactionItems = async (prisma: prismaType, transactionId: string) => {
	return await prisma.transactionItem.findMany({ where: { transactionId } });
};

// get Transaction Items Server Resource
export const getServerTransactionItemsData$ = (params: Params) =>
	createServerData$(
		async ([, id]) => {
			return await prisma.transactionItem.findMany({ where: { transactionId: id } });
		},
		{ key: () => ["transaction", params.id], deferStream: true }
	);

// get Transaction Item
export const getTransactionItem = async (prisma: prismaType, transactionItemId: string) => {
	return await prisma.transactionItem.findUnique({
		where: {
			id: transactionItemId,
		},
	});
};

// get Transaction Item Server Resource
export const getServerTransactionItemData$ = () =>
	createServerData$(
		async (transactionItemId: string) => {
			return await prisma.transactionItem.findUnique({
				where: {
					id: transactionItemId,
				},
			});
		},
		{
			deferStream: true,
		}
	);
