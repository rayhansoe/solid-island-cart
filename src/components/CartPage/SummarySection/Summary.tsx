import type { Transaction, TransactionItem } from "@prisma/client";
import { debounce } from "@solid-primitives/scheduled";
import { batch, createEffect, createSignal, Show } from "solid-js";
import { reconcile } from "solid-js/store";
import { A } from "solid-start";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import TransactionContext from "~/context/TransactionContext";
import { formatCurrency } from "~/utilities/formatCurrency";

export default function Summary() {
	let aRef: any;
	const { cartItems, isLoading, isSubmitting, setCartItems, setIsLoading, setIsSubmitting } =
		CartContext;
	const { products, setProducts } = ProductContext;
	const { handleCreateTransaction } = TransactionContext;

	const [url, setUrl] = createSignal("");

	const navigate = () => aRef.click();

	const debouncedNavigate = debounce(navigate, 0);

	createEffect(() => {
		if (url() !== "") {
			debouncedNavigate();
		}
	});

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
						// onClick={() => {
						// 	const r = handleCreateTransaction();
						// 	r.then((response) => {
						// 		if (response?.transaction) {
						// 			batch(() => {
						// 				setIsLoading(false);
						// 				setIsSubmitting(false);
						// 				setCartItems([]);
						// 			});

						// 			console.log("sukes");

						// 			// throw redirect(`/transaction/${response.transaction.id}`);
						// 			navigate(`/transaction/${response?.transaction.id}`, { replace: true });
						// 			return;
						// 		}
						// 		batch(() => {
						// 			setIsLoading(false);
						// 			setIsSubmitting(false);
						// 		});
						// 		console.log("pail");
						// 		// throw redirect("/");
						// 		navigate("/", { replace: true });
						// 		return;
						// 	}).catch((e) => {
						// 		console.error(e);
						// 		// throw redirect("/");
						// 		navigate("/", { replace: true });
						// 	});
						// }}
						// onClick={() => {
						// 	setIsSubmitting(true);
						// 	createTransaction$()
						// 		.then((r) => {
						// 			if (r?.transaction) {
						// 				console.log("sukes");
						// 				batch(() => {
						// 					setIsLoading(false);
						// 					setIsSubmitting(false);
						// 					setCartItems([]);
						// 					setUrl(`/transaction/${r?.transaction.id}`);
						// 					aRef.click();
						// 				});

						// 				return;
						// 			}
						// 			batch(() => {
						// 				setIsLoading(false);
						// 				setIsSubmitting(false);
						// 			});
						// 		})
						// 		.catch((e) => {
						// 			console.error(e);
						// 			setUrl("/");
						// 			aRef.click();
						// 		});
						// }}
						// onClick={() => {
						// 	batch(() => {
						// 		setIsSubmitting(true);
						// 		setIsLoading(true);
						// 	});
						// 	mutation.mutate();
						// }}
						onClick={async () => {
							const response = await handleCreateTransaction();
							if (response) {
								setUrl(`/transaction/${response.transaction.id}`);
							}
						}}
						class='w-full px-2 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-400 active:bg-blue-300 disabled:cursor-not-allowed disabled:bg-blue-100 disabled:text-gray-500'
					>
						Checkout
					</button>
				</Show>
				<A class='absolute -z-10 bg-transparent opacity-0' ref={aRef} href={url()}>
					{/* {url() || "yess"} */}
				</A>
			</div>
		</>
	);
}
