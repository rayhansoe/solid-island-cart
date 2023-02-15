import type { Transaction, TransactionItem } from "@prisma/client";
import { batch, createRoot, createSignal } from "solid-js";
import server$ from "solid-start/server";
import { getCartItems, removeCartItems } from "~/services/CartServices";
import { decreaseProductsStock } from "~/services/ProductServices";
import { createTransaction, createTransactionItem } from "~/services/TransactionServices";
import CartContext from "./CartContext";
import ProductContext from "./ProductContext";
import { prisma } from "~/server/db/client";

function createTransactionContext() {
	const [transactions, setTransactions] = createSignal<Transaction[]>([]);
	const [transactionItems, setTransactionItems] = createSignal<TransactionItem[]>([]);
	const { setIsSubmitting, setIsLoading } = CartContext;
	const { router } = ProductContext;

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

			if (!newTransactionItems) {
				throw new Error("failed to create new transaction Items record, please try again!");
			}

			const products = await decreaseProductsStock(prisma);

			await removeCartItems(prisma);

			const newCartItems = await getCartItems(prisma);

			if (newCartItems.length) {
				throw new Error("failed to create new transaction Items record, please try again!");
			}
			await removeCartItems(prisma);

			// const products = await getProducts(prisma);

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
			router.push(`/transaction/${response.transaction.id}`);
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
	};
}
export default createRoot(createTransactionContext);
