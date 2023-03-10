import type { Setter } from "solid-js";
import { batch, createRoot, createSignal } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import server$ from "solid-start/server";
// import {
// 	createCartItem,
// 	decreaseCartItem,
// 	getCartItem,
// 	getCartItemByProductId,
// 	getCartItems,
// 	// getCartItems$ as getCartItemsRPC$,
// 	increaseCartItem,
// 	removeCartItem,
// 	setCartItemQuantity,
// } from "~/services/CartServices";
import { getProduct, updateProductPopularityLite } from "~/services/ProductServices";
import type { CartItemProps } from "~/types";
import { prisma } from "~/server/db/client";

// const data: CartItemProps[] = await getCartItemsRPC$();
import type { prismaType } from "~/types";
// import { getProducts } from "./ProductServices";
// import { prisma } from "~/server/db/client";

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

// READ

// get CartItems
export const getCartItems = async (prisma: prismaType) => {
	const cartItems = await prisma.cartItem.findMany({
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItems;
};

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

// DELETE

// delete Cart Item
export const removeCartItem = async (prisma: prismaType, cartId: string) => {
	return await prisma.cartItem.delete({
		where: { id: cartId },
	});
};

function createCartContext() {
	const [cartItems, setCartItems] = createStore<CartItemProps[]>([]);
	const [isLoading, setIsLoading] = createSignal<boolean>(false);
	const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
	const [isIncreasing, setIsIncreasing] = createSignal<boolean>(false);

	const increaseCartItem$ = server$(async (productId: string) => {
		try {
			// Get Product & Cart Item
			const product = await getProduct(prisma, productId);
			const item = await getCartItemByProductId(prisma, productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite(prisma, product.id, product.popularity);

			// Check Stock
			if (product.stock === 0) {
				throw new Error("Product out of stock!");
			}

			// Check Item
			if (!item?.id) {
				await createCartItem(prisma, product.id);
				const updatedCartItems = await getCartItems(prisma);
				return updatedCartItems;
			}

			// Check if Item quantity is equal with product stock
			if (product.stock === item.quantity) {
				await setCartItemQuantity(prisma, item.id, product.stock);
				const updatedCartItems = await getCartItems(prisma);
				return updatedCartItems;
			}

			// increase item
			await increaseCartItem(prisma, item.id);
			const updatedCartItems = await getCartItems(prisma);
			return updatedCartItems;
		} catch (error) {
			console.error(error);
		}
	});

	const decreaseCartItem$ = server$(async (productId: string) => {
		try {
			// Get Product & Cart Item
			const product = await getProduct(prisma, productId);
			const item = await getCartItemByProductId(prisma, productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Check Item
			if (!item?.id) {
				throw new Error("Failed to get Item or Item is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite(prisma, product.id, product.popularity);

			if (item.quantity === 1) {
				await removeCartItem(prisma, item.id);
				const updatedCartItems = await getCartItems(prisma);
				return updatedCartItems;
			}

			await decreaseCartItem(prisma, item.id);
			const updatedCartItems = await getCartItems(prisma);
			return updatedCartItems;
		} catch (error) {
			console.error(error);
		}
	});

	const removeFromCartItem$ = server$(async (productId: string) => {
		try {
			// Get Product & Cart Item
			const product = await getProduct(prisma, productId);
			const item = await getCartItemByProductId(prisma, productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Check Item
			if (!item?.id) {
				throw new Error("Failed to get Item or Item is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite(prisma, product.id, product.popularity);

			await removeCartItem(prisma, item.id);
			const updatedCartItems = await getCartItems(prisma);
			return updatedCartItems;
		} catch (error) {
			console.error(error);
		}
	});

	const setCartItemQuantityByProductId$ = server$(
		async (productId: string, newQuantity: number) => {
			try {
				// Get Product & Cart Item
				const product = await getProduct(prisma, productId);
				const item = await getCartItemByProductId(prisma, productId);

				// Check Product
				if (!product?.id || typeof product?.popularity !== "number") {
					throw new Error("Failed to get Product or Product is not Found!");
				}

				// Check Item
				if (!item?.id) {
					await createCartItem(prisma, product.id);
					const updatedCartItems = await getCartItems(prisma);
					return updatedCartItems;
				}

				// Update Product Popu
				await updateProductPopularityLite(prisma, product.id, product.popularity);

				if (Number.isNaN(newQuantity)) {
					await setCartItemQuantity(prisma, item.id, item.quantity);
					const updatedCartItems = await getCartItems(prisma);
					return updatedCartItems;
				}

				if (typeof newQuantity !== "number") {
					throw new Error("Invalid New Quantity!");
				}

				if (newQuantity === 0) {
					await removeCartItem(prisma, item.id);
					const updatedCartItems = await getCartItems(prisma);
					return updatedCartItems;
				}

				if (product.stock < newQuantity) {
					await setCartItemQuantity(prisma, item.id, product.stock);
					const updatedCartItems = await getCartItems(prisma);
					return updatedCartItems;
				}

				await setCartItemQuantity(prisma, item.id, newQuantity);
				const updatedCartItems = await getCartItems(prisma);
				return updatedCartItems;
			} catch (error) {
				console.error(error);
			}
		}
	);

	const setCartItemQuantityByCartItemId$ = server$(async (cartId: string, newQuantity: number) => {
		try {
			// Get Product & Cart Item
			const item = await getCartItem(prisma, cartId);

			// Check Item
			if (!item?.id) {
				throw new Error("Failed to get Cart Item or Cart Item is not Found!");
			}

			const product = await getProduct(prisma, item.productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite(prisma, product.id, product.popularity);

			if (Number.isNaN(newQuantity)) {
				await setCartItemQuantity(prisma, item.id, item.quantity);
				const updatedCartItems = await getCartItems(prisma);
				return updatedCartItems;
			}

			if (typeof newQuantity !== "number") {
				throw new Error("Invalid New Quantity!");
			}

			if (newQuantity === 0) {
				await removeCartItem(prisma, item.id);
				const updatedCartItems = await getCartItems(prisma);
				return updatedCartItems;
			}

			if (product.stock < newQuantity) {
				await setCartItemQuantity(prisma, item.id, product.stock);
				const updatedCartItems = await getCartItems(prisma);
				return updatedCartItems;
			}

			await setCartItemQuantity(prisma, item.id, newQuantity);
			const updatedCartItems = await getCartItems(prisma);
			return updatedCartItems;
		} catch (error) {
			console.error(error);
		}
	});

	const handleIncreaseCartItem = async (productId: string, setIsIncreasing: Setter<boolean>) => {
		setIsSubmitting(true);
		setIsIncreasing(true);
		const response = await increaseCartItem$(productId);

		// Fail to increase item
		if (!response?.length) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
				setIsIncreasing(false);
			});
			return;
		}

		batch(() => {
			setCartItems(reconcile(response));
			setIsLoading(false);
			setIsSubmitting(false);
			setIsIncreasing(false);
		});

		return;
	};

	const handleDecreaseCartItem = async (productId: string) => {
		const response = await decreaseCartItem$(productId);

		// if item has been removed
		if (!response) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});
			return;
		}

		batch(() => {
			setCartItems(reconcile(response));
			setIsLoading(false);
			setIsSubmitting(false);
		});

		return;
	};

	const handleRemoveCartItem = async (productId: string, setIsRemoving: Setter<boolean>) => {
		setIsSubmitting(true);
		setIsRemoving(true);
		const response = await removeFromCartItem$(productId);

		// fail to remove item
		if (!response) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
				setIsRemoving(false);
			});
			return;
		}

		if (response.find((item) => item.productId === productId)?.id) {
			batch(() => {
				setCartItems(reconcile(response));
				setIsLoading(false);
				setIsSubmitting(false);
				setIsRemoving(false);
			});
			return;
		}

		batch(() => {
			setCartItems((items) => items.filter((item) => item.productId !== productId));
			setCartItems(reconcile(response));
			setIsLoading(false);
			setIsSubmitting(false);
			setIsRemoving(false);
		});

		return;
	};

	const handleSetCartItemQuantityByProductId = async (
		productId: string,
		quantity: number,
		setIsLocalLoading: Setter<boolean>
	) => {
		setIsSubmitting(true);
		setIsLocalLoading(true);
		const response = await setCartItemQuantityByProductId$(productId, quantity);

		// if item has been removed
		if (!response) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
				setIsLocalLoading(false);
			});
			return;
		}

		batch(() => {
			setCartItems(reconcile(response));
			setIsLoading(false);
			setIsSubmitting(false);
			setIsLocalLoading(false);
		});

		return;
	};

	const handleSetCartItemQuantityByCartItemId = async (
		cartId: string,
		quantity: number,
		setIsLocalLoading: Setter<boolean>
	) => {
		setIsSubmitting(true);
		setIsLocalLoading(true);
		const response = await setCartItemQuantityByCartItemId$(cartId, quantity);

		// if item has been removed
		if (!response) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
				setIsLocalLoading(false);
			});
			return;
		}

		batch(() => {
			setCartItems(reconcile(response));
			setIsLoading(false);
			setIsSubmitting(false);
			setIsLocalLoading(false);
		});

		return;
	};

	const getCartItemClient = (id: string) => cartItems?.find((item) => item.productId === id);

	const getCartItemQuantityByCartId = (cartId: string) =>
		cartItems?.find((item) => item.id === cartId)?.quantity || 0;

	const getCartItemQuantityByProductId = (productId: string) =>
		cartItems?.find((item) => item.productId === productId)?.quantity || 0;

	return {
		cartItems,
		isLoading,
		isSubmitting,
		isIncreasing,
		setCartItems,
		setIsSubmitting,
		setIsIncreasing,
		setIsLoading,
		handleIncreaseCartItem,
		handleDecreaseCartItem,
		handleRemoveCartItem,
		handleSetCartItemQuantityByCartItemId,
		handleSetCartItemQuantityByProductId,
		getCartItemClient,
		getCartItemQuantityByCartId,
		getCartItemQuantityByProductId,
	};
}
export default createRoot(createCartContext);
