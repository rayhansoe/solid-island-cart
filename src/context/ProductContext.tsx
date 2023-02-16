/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Setter } from "solid-js";
import { createSignal } from "solid-js";
import { createEffect, createRoot } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import server$ from "solid-start/server";
// import {
// 	getProducts,
// 	// getProducts$,
// 	reStockProduct,
// } from "~/services/ProductServices";
import type { prismaType, ProductProps } from "~/types";
import { prisma } from "~/server/db/client";
import { A } from "solid-start";

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

function createProductContext() {
	const [products, setProducts] = createStore<ProductProps[]>([]);

	const reStockProduct$ = server$(async (productId: string) => {
		try {
			const updatedProductStock = await reStockProduct(prisma, productId);

			if (!updatedProductStock) {
				throw new Error("Failed to re-stock Product.");
			}

			const updatedProducts = await getProducts(prisma);

			if (!updatedProducts) {
				throw new Error("Failed to get updated Products.");
			}

			return updatedProducts;
		} catch (error) {
			console.log(error);
		}
	});

	const getProductClient = (id: string) => products?.find((product) => product.id === id);

	const handleReStockProduct = async (productsId: string, setIsReStocking: Setter<boolean>) => {
		setIsReStocking(true);
		const response = await reStockProduct$(productsId);

		if (!response?.length) {
			setIsReStocking(false);
			return;
		}

		setProducts(reconcile(response));
		setIsReStocking(false);
		return products;
	};
	const push = (path: string) => {
		const [isClicked, setIsClicked] = createSignal<boolean>(false);
		let aRef: HTMLAnchorElement | ((el: HTMLAnchorElement) => void) | any;
		const body = document.body;
		const newA: HTMLAnchorElement | ((el: HTMLAnchorElement) => void) | any = (
			<A class='absolute -z-10 bg-transparent opacity-0' id='' ref={aRef} href={path} />
		);

		createEffect(() => {
			if (newA) {
				body.append(newA);
			}
		});

		createEffect(() => {
			if (isClicked()) {
				newA.remove();
			}
		});

		// debouncedNavigate();
		aRef.click();
		setIsClicked(true);
	};

	const router = { push };

	return {
		products,
		setProducts,
		getProductClient,
		handleReStockProduct,
		router,
	};
}
export default createRoot(createProductContext);
