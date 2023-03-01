/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable solid/reactivity */
import autoAnimate from "@formkit/auto-animate";
import { createComputed, createEffect, createSignal, Show } from "solid-js";
import { A } from "solid-start";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import type { CartItemProps, ProductProps } from "~/types";
import CartSection from "./CartSection";
import SummarySection from "./SummarySection/(SummarySection)";

export default function DynamicCart(props: {
	cartItems: CartItemProps[];
	products: ProductProps[];
}) {
	const { cartItems, isSubmitting } = CartContext;
	const { products } = ProductContext;
	let animationParent: HTMLUListElement | ((el: HTMLUListElement) => void) | any;

	createEffect(() => {
		animationParent && autoAnimate(animationParent);
	});

	const [cartItemsQuantity, setCartItemsQuantity] = createSignal(props.cartItems.length);

	createComputed(() => setCartItemsQuantity(cartItems.length));

	return (
		<div ref={animationParent}>
			<Show
				when={cartItemsQuantity()}
				fallback={
					<Show when={!isSubmitting()}>
						<div class='relative flex h-full flex-col gap-4 md:flex-row md:gap-8'>
							<div class='flex flex-col w-full py-10 mx-auto text-center gap-4 m-6 rounded-xl shadow border border-gray-200'>
								<h1 class='font-semibold text-gray-700 text-2xl md:text-5xl'>
									Your Cart is Empty!
								</h1>
								<h2 class='font-semibold text-gray-700  md:text-2xl'>
									Go Find Your Favourite Products Now.
								</h2>
								<A href='/' class='text-lg font-semibold text-blue-400 hover:underline'>
									Store!
								</A>
							</div>
						</div>
					</Show>
				}
			>
				<div class='relative flex h-full w-full flex-col gap-4 md:flex-row md:gap-8 lg:gap-14'>
					{/* Cart */}
					<div class='parent-island container flex flex-col items-center md:w-3/5 lg:w-2/3'>
						<CartSection
							cartItems={props.cartItems || cartItems}
							products={props.products || products}
						/>
					</div>

					{/* Summary Cart */}
					<div class='parent-island flex w-full h-min flex-col py-4 gap-3 sticky bottom-0 bg-white md:border md:border-gray-100 md:border-opacity-90 md:p-3 md:w-2/5 md:top-28 md:shadow-lg md:rounded lg:text-xl lg:w-1/3'>
						<SummarySection
							cartItems={props.cartItems || cartItems}
							products={props.products || products}
						/>
					</div>
				</div>
			</Show>
		</div>
	);
}
