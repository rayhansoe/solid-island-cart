import type { Product } from "@prisma/client";
import { createServerData$ } from "solid-start/server";
import type { prismaType } from "~/types";
import { getCartItems } from "./CartServices";
import { prisma } from "~/server/db/client";

// CREATE

// Create Product
export const createProduct = async (prisma: prismaType, productData: Product) => {
	return await prisma.product.create({
		data: {
			...productData,
		},
		select: {
			id: true,
			name: true,
			category: true,
			stock: true,
			price: true,
			imgUrl: true,
			popularity: true,
		},
	});
};

// Create Product Raw
export const createProductRaw = async (prisma: prismaType, productData: Product) => {
	return await prisma.product.create({
		data: {
			...productData,
		},
	});
};

// Create Products
export const createManyProduct = async (prisma: prismaType, productsData: Product[]) => {
	return productsData.map(async (product) => {
		return await prisma.product.create({
			data: {
				...product,
			},
			select: {
				id: true,
				name: true,
				category: true,
				stock: true,
				price: true,
				imgUrl: true,
				popularity: true,
			},
		});
	});
};

// Create Products Raw
export const createManyProductRaw = async (prisma: prismaType, productsData: Product[]) => {
	return productsData.map(async (product) => {
		return await prisma.product.create({
			data: {
				...product,
			},
		});
	});
};

// READ

// get Products
export const getProducts = async (prisma: prismaType) => {
	return await prisma.product.findMany({
		orderBy: {
			popularity: "desc",
		},
		select: {
			id: true,
			name: true,
			category: true,
			stock: true,
			price: true,
			imgUrl: true,
			popularity: true,
		},
	});
};

// get Products
export const getProductsRaw = async (prisma: prismaType) => {
	return await prisma.product.findMany({
		orderBy: {
			popularity: "desc",
		},
	});
};

// get Products server data
export const getServerProductsData$ = () =>
	createServerData$(
		async () => {
			return await prisma.product.findMany({
				orderBy: {
					popularity: "desc",
				},
				select: {
					id: true,
					name: true,
					category: true,
					stock: true,
					price: true,
					imgUrl: true,
					popularity: true,
				},
			});
		},
		{
			deferStream: true,
		}
	);

// get Products server data
export const getServerProductsDataRaw$ = () =>
	createServerData$(
		async () => {
			return await prisma.product.findMany({
				orderBy: {
					popularity: "desc",
				},
			});
		},
		{
			deferStream: true,
		}
	);

// get Product
export const getProduct = async (prisma: prismaType, productId: string) => {
	return await prisma.product.findUnique({
		where: { id: productId },
		select: {
			id: true,
			name: true,
			category: true,
			stock: true,
			price: true,
			imgUrl: true,
			popularity: true,
		},
	});
};

// get Product
export const getProductRaw = async (prisma: prismaType, productId: string) => {
	return await prisma.product.findUnique({
		where: { id: productId },
	});
};

// get Product server data
export const getServerProductData$ = () =>
	createServerData$(
		async (productId: string) => {
			return await prisma.product.findUnique({
				where: { id: productId },
				select: {
					id: true,
					name: true,
					category: true,
					stock: true,
					price: true,
					imgUrl: true,
					popularity: true,
				},
			});
		},
		{
			deferStream: true,
		}
	);

// get Product server data
export const getServerProductDataRaw$ = () =>
	createServerData$(
		async (productId: string) => {
			return await prisma.product.findUnique({
				where: {
					id: productId,
				},
			});
		},
		{
			deferStream: true,
		}
	);

// get Product Stock
export const getProductStock = async (prisma: prismaType, productId: string) => {
	const product = await getProduct(prisma, productId);
	return product?.stock;
};

// get Product Stock Server Resource
export const getServerProductStockData$ = () =>
	createServerData$(
		async (productId: string) => {
			const product = await getProduct(prisma, productId);
			return product?.stock;
		},
		{
			deferStream: true,
		}
	);

// UPDATE

// Update Product Popularity Lite
export const updateProductPopularityLite = async (
	prisma: prismaType,
	productId: string,
	prevPopularity: number
) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			popularity: prevPopularity + 1,
			updatedAt: new Date(),
		},
		select: {
			id: true,
			name: true,
			category: true,
			stock: true,
			price: true,
			imgUrl: true,
			popularity: true,
		},
	});
};

// Update Product Popularity Lite Raw
export const updateProductPopularityLiteRaw = async (
	prisma: prismaType,
	productId: string,
	prevPopularity: number
) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			popularity: prevPopularity + 1,
			updatedAt: new Date(),
		},
	});
};

// Update Product Popularity
export const updateProductPopularity = async (
	prisma: prismaType,
	productId: string,
	prevPopularity: number
) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			popularity: prevPopularity + 1,
			updatedAt: new Date(),
		},
		select: {
			id: true,
			name: true,
			category: true,
			stock: true,
			price: true,
			imgUrl: true,
			popularity: true,
		},
	});
};

// Update Product Popularity Raw
export const updateProductPopularityRaw = async (
	prisma: prismaType,
	productId: string,
	prevPopularity: number
) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			popularity: prevPopularity + 1,
			updatedAt: new Date(),
		},
	});
};

// Decrease Product Stock
export const decreaseProductsStock = async (prisma: prismaType) => {
	const cartItems = await getCartItems(prisma);
	const arrQuery = cartItems.map((item) =>
		prisma.product.update({
			where: {
				id: item.productId,
			},
			data: {
				stock: {
					decrement: item.quantity,
				},
			},
		})
	);

	return await prisma.$transaction(arrQuery);
};

// Decrease Product Stock
export const decreaseProductStock = async (
	prisma: prismaType,
	productId: string,
	itemQuantity: number
) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			stock: {
				decrement: itemQuantity,
			},
			updatedAt: new Date(),
		},
		select: {
			id: true,
			name: true,
			category: true,
			stock: true,
			price: true,
			imgUrl: true,
			popularity: true,
		},
	});
};

// Decrease Product Stock Raw
export const decreaseProductStockRaw = async (
	prisma: prismaType,
	productId: string,
	prevStock: number,
	itemQuantity: number
) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			stock: prevStock - itemQuantity,
			updatedAt: new Date(),
		},
	});
};

// Product re-Stock
export const reStockProduct = async (prisma: prismaType, productId: string) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			stock: 9999,
			updatedAt: new Date(),
		},
		select: {
			id: true,
			name: true,
			category: true,
			stock: true,
			price: true,
			imgUrl: true,
			popularity: true,
		},
	});
};

// Product re-Stock Raw
export const reStockProductRaw = async (prisma: prismaType, productId: string) => {
	return await prisma.product.update({
		where: { id: productId },
		data: {
			stock: 9999,
			updatedAt: new Date(),
		},
	});
};
