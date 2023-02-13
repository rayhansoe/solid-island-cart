import { Show } from "solid-js";
import CartContext from "~/context/CartContext";
import type { CartItemProps, ProductProps } from "~/types";
import CartList from "./CartList";

export default function CartSection(props: {
	cartItems: CartItemProps[];
	products: ProductProps[];
}) {
	const { cartItems } = CartContext;
	return (
		<Show when={props.cartItems.length || cartItems?.length}>
			<CartList cartItems={props.cartItems} products={props.products} />
		</Show>
	);
}
