import { Show } from "solid-js";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import type { CartItemProps, ProductProps } from "~/types";
import CartList from "./CartList";

export default function CartSection(props: {
	cartItems: CartItemProps[];
	products: ProductProps[];
}) {
	const { cartItems } = CartContext;
	const { products } = ProductContext;
	return (
		<Show when={props.cartItems.length || cartItems?.length}>
			<CartList cartItems={props.cartItems || cartItems} products={props.products || products} />
		</Show>
	);
}
