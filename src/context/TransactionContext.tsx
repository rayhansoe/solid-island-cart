import type { Transaction, TransactionItem } from "@prisma/client";
import { batch, createRoot, createSignal } from "solid-js";
import server$, { redirect } from "solid-start/server";
import { getCartItems, removeCartItems } from "~/services/CartServices";
import { decreaseProductStock, getProducts } from "~/services/ProductServices";
import { createTransaction, createTransactionItem } from "~/services/TransactionServices";
import CartContext from "./CartContext";
import ProductContext from "./ProductContext";
import { prisma } from "~/server/db/client";
import { reconcile } from "solid-js/store";

function createTransactionContext() {
	const [transactions, setTransactions] = createSignal<Transaction[]>([]);
	const [transactionItems, setTransactionItems] = createSignal<TransactionItem[]>([]);
	const { setCartItems, setIsSubmitting, setIsLoading } = CartContext;
	const { setProducts } = ProductContext;

	const rd$ = server$(async (url: string) => {
		console.log(url);

		return redirect(url, 200);
	});

	const createTransaction$ = server$(async () => {
		try {
			const cartItems = await getCartItems(prisma);

			if (!cartItems.length) {
				throw new Error("there is no item in cart right now.");
			}

			const newTransaction = await createTransaction(prisma);

			if (!newTransaction) {
				throw new Error("failed to proceed this transaction, please try again!");
			}

			const newTransactionItems = await createTransactionItem(prisma, newTransaction.id);

			// cartItems?.forEach(async (item) => {
			// 	await decreaseProductStock$(item.productId, item.quantity);
			// });

			// try {
			// 	for (const { productId, quantity } of cartItems) {
			// 		// await decreaseProductStock(prisma, productId, quantity);
			// 		return await prisma.product.update({
			// 			where: { id: productId },
			// 			data: {
			// 				stock: {
			// 					decrement: quantity,
			// 				},
			// 			},
			// 		});
			// 	}
			// } catch (error) {}

			const arry = cartItems.map((item) =>
				prisma.product.update({
					where: { id: item.productId },
					data: {
						stock: {
							decrement: item.quantity,
						},
					},
				})
			);
			await prisma.$transaction(arry);

			// await decreaseProductsStockExperimental$(cartItems);
			// await log("decrease products stock");

			if (!newTransactionItems) {
				throw new Error("failed to create new transaction Items record, please try again!");
			}

			// cartItems.forEach(async (item) => {
			// 	await removeCartItem$(item.id);
			// });
			await removeCartItems(prisma);

			const newCartItems = await getCartItems(prisma);

			if (newCartItems.length) {
				throw new Error("failed to create new transaction Items record, please try again!");
			}
			await removeCartItems(prisma);

			const products = await getProducts(prisma);

			if (!products.length) {
				throw new Error("failed to create new transaction Items record, please try again!");
			}

			return {
				transaction: newTransaction,
				transactionItems: newTransactionItems,
				cartItems: newCartItems,
				products,
			};
		} catch (error) {
			console.error(error);
		}
	});

	const handleCreateTransaction = async () => {
		setIsSubmitting(true);
		const response = await createTransaction$();

		if (response?.transaction) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
				setCartItems(reconcile(response.cartItems));
				setProducts(reconcile(response.products));
			});
			return response;
		} else {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});

			return response;
		}
	};

	return {
		transactions,
		transactionItems,
		setTransactions,
		setTransactionItems,
		handleCreateTransaction,
		createTransaction$,
		rd$,
	};
}
export default createRoot(createTransactionContext);
