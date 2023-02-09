import { Show } from "solid-js";
import { unstable_island } from "solid-start";
import CartContext from "~/context/CartContext";

const CartList = unstable_island(() => import("./CartList/index"));

export default function CartSection() {
	const { cartItems } = CartContext;
	return (
		<Show when={cartItems?.length}>
			<CartList />
		</Show>
	);
}
