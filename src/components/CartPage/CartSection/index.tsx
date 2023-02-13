import { Show } from "solid-js";
import CartContext from "~/context/CartContext";
import CartList from "./CartList";

export default function CartSection() {
	const { cartItems } = CartContext;
	return (
		<Show when={cartItems?.length}>
			<CartList />
		</Show>
	);
}
