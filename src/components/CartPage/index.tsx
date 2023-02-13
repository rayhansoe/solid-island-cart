import { unstable_island } from "solid-start";
import type { CartItemProps, ProductProps } from "~/types";
const DynamicCart = unstable_island(() => import("./DynamicCart"));

export default function CartPage(props: { cartItems: CartItemProps[]; products: ProductProps[] }) {
	return <DynamicCart cartItems={props.cartItems} products={props.products} />;
}
