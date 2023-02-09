/* eslint-disable @typescript-eslint/no-explicit-any */

import { createEffect, For, Show } from "solid-js";
import CartContext from "~/context/CartContext";

import autoAnimate from "@formkit/auto-animate";
import CartItem from "../CartItem";

export default function CartList() {
	const { cartItems } = CartContext;

	let animationParent: HTMLUListElement | ((el: HTMLUListElement) => void) | any;

	createEffect(() => {
		animationParent && autoAnimate(animationParent);
	});

	createEffect(() => {
		console.log(cartItems);
	});

	return (
		<Show when={cartItems?.length}>
			<ul ref={animationParent} class='parent-island container flex flex-col w-full '>
				<For each={cartItems}>{(item) => <CartItem {...item} />}</For>
			</ul>
		</Show>
	);
}
