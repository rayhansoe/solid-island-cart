import type { Prisma, PrismaClient } from "@prisma/client";

export interface CartItemProps {
	id: string;
	quantity: number;
	productId: string;
	isChecked: boolean;
	status: boolean;
	updatedAt?: Date;
	createdAt?: Date;
}

export interface ProductProps {
	id: string;
	name: string;
	category: string;
	stock: number;
	price: number;
	imgUrl: string;
	createdAt?: Date;
	updatedAt?: Date;
	popularity: number;
}

export interface TransactionProps {
	id: string;
	updatedAt?: Date;
	createdAt?: Date;
	totalPrice: number;
}

export interface TransactionItemProps {
	id: string;
	transactionId: string;
	quantity: number;
	productId: string;
	updatedAt?: Date;
	createdAt?: Date;
}

export type prismaType = PrismaClient<
	Prisma.PrismaClientOptions,
	never,
	Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;
