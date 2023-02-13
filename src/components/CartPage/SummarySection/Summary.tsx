import { Show } from "solid-js";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import TransactionContext from "~/context/TransactionContext";
import { formatCurrency } from "~/utilities/formatCurrency";

export default function Summary() {
	const { cartItems, isLoading, isSubmitting } = CartContext;
	const { products } = ProductContext;
	const { handleCreateTransaction } = TransactionContext;

	return (
		<>
			<div class='flex w-full h-min flex-col gap-3 '>
				<Show when={cartItems?.length}>
					<div class='parent-island flex items-center justify-between text-lg font-semibold'>
						<span class='text-lg'>Total:</span>
						<span>
							{formatCurrency(
								cartItems?.reduce(
									(totalPrice, cartItem) =>
										cartItem.quantity *
											Number(products?.find((item) => item.id === cartItem.productId)?.price || 0) +
										totalPrice,
									0
								) || 0
							)}
						</span>
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
