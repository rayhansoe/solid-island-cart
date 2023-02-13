import type { CartItemProps, ProductProps } from "~/types";
import Summary from "./Summary";

export default function SummarySection(props: {
	cartItems: CartItemProps[];
	products: ProductProps[];
}) {
	return <Summary cartItems={props.cartItems} products={props.products} />;
}
