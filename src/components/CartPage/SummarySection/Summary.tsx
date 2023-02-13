/* eslint-disable solid/reactivity */
import { createEffect, createSignal, Show } from "solid-js";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import TransactionContext from "~/context/TransactionContext";
import type { CartItemProps, ProductProps } from "~/types";
import { formatCurrency } from "~/utilities/formatCurrency";

export default function Summary(props: { cartItems: CartItemProps[]; products: ProductProps[] }) {
	const { cartItems, isLoading, isSubmitting } = CartContext;
	const { products } = ProductContext;
	const { handleCreateTransaction } = TransactionContext;

	const [getSum, setSum] = createSignal<number>(
		props.cartItems?.reduce(
			(totalPrice, cartItem) =>
				cartItem.quantity *
					Number(props.products?.find((item) => item.id === cartItem.productId)?.price || 0) +
				totalPrice,
			0
		)
	);

	createEffect(() => {
		setSum(
			props.cartItems?.reduce(
				(totalPrice, cartItem) =>
					cartItem.quantity *
						Number(props.products?.find((item) => item.id === cartItem.productId)?.price || 0) +
					totalPrice,
				0
			)
		);
	});

	createEffect(() => {
		setSum(
			cartItems?.reduce(
				(totalPrice, cartItem) =>
					cartItem.quantity *
						Number(products?.find((item) => item.id === cartItem.productId)?.price || 0) +
					totalPrice,
				0
			)
		);
	});

	return (
		<>
			<div class='flex w-full h-min flex-col gap-3 '>
				<Show when={props.cartItems?.length || cartItems?.length}>
					<div class='parent-island flex items-center justify-between text-lg font-semibold'>
						<span class='text-lg'>Total:</span>
						<span>{formatCurrency(getSum())}</span>
					</div>
					<button
						disabled={isLoading() || isSubmitting() ? true : false}
						onClick={async () => {
							await handleCreateTransaction();
						}}
						class='w-full px-2 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-400 active:bg-blue-300 disabled:cursor-not-allowed disabled:bg-blue-100 disabled:text-gray-500'
					>
						Checkout
					</button>
				</Show>
			</div>
		</>
	);
}
