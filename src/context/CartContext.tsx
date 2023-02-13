import type { Setter } from "solid-js";
import { batch, createRoot, createSignal } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import server$ from "solid-start/server";
import {
	createCartItem,
	decreaseCartItem,
	getCartItem,
	getCartItemByProductId,
	getCartItems,
	getCartItems$ as getCartItemsRPC$,
	increaseCartItem,
	removeCartItem,
	setCartItemQuantity,
} from "~/services/CartServices";
import { getProduct, updateProductPopularityLite } from "~/services/ProductServices";
import type { CartItemProps } from "~/types";
import productContext from "./ProductContext";
import { prisma } from "~/server/db/client";

const data: CartItemProps[] = await getCartItemsRPC$();

function createCartContext() {
	const { getProductClient } = productContext;
	const [cartItems, setCartItems] = createStore<CartItemProps[]>(data || []);
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

		batch(() => {
			setCartItems(reconcile(response));
			setIsLoading(false);
			setIsSubmitting(false);
			setIsRemoving(false);
		});

		return;
	};

	const handleSetCartItemQuantityByProductId = async (productId: string, quantity: number) => {
		setIsSubmitting(true);
		const response = await setCartItemQuantityByProductId$(productId, quantity);

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

	const handleSetCartItemQuantityByCartItemId = async (cartId: string, quantity: number) => {
		setIsSubmitting(true);
		const response = await setCartItemQuantityByCartItemId$(cartId, quantity);

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

	const getCartQuantity = () => cartItems?.reduce((quantity, item) => item.quantity + quantity, 0);

	const getCartItemClient = (id: string) => cartItems?.find((item) => item.productId === id);

	const getCartItemQuantityByCartId = (cartId: string) =>
		cartItems?.find((item) => item.id === cartId)?.quantity || 0;

	const getCartItemQuantityByProductId = (productId: string) =>
		cartItems?.find((item) => item.productId === productId)?.quantity || 0;

	const getTotalPrice = () =>
		cartItems?.length
			? cartItems?.reduce(
					(totalPrice, cartItem) =>
						cartItem.quantity * Number(getProductClient(cartItem.productId)?.price) + totalPrice,
					0
			  )
			: 0;

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
		getCartQuantity,
		getCartItemClient,
		getCartItemQuantityByCartId,
		getCartItemQuantityByProductId,
		getTotalPrice,
	};
}
export default createRoot(createCartContext);
