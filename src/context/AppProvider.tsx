import { batch, createEffect, useContext } from "solid-js";
import type { JSX } from "solid-js";
import { createContext } from "solid-js";
import type { CartItemProps, ProductProps } from "~/types";
import CartContext from "./CartContext";
import ProductContext from "./ProductContext";
import { reconcile } from "solid-js/store";

const AppContext = createContext();

export default function AppProvider(props: {
	children: JSX.Element;
	cartItems: CartItemProps[] | undefined;
	products: ProductProps[] | undefined;
}) {
	const { setProducts } = ProductContext;
	const { setCartItems, setIsLoading, setIsSubmitting } = CartContext;

	createEffect(() => {
		console.log(props.cartItems);
	});

	createEffect(() => {
		console.log(props.products);
	});

	createEffect(() => {
		batch(() => {
			if (props.cartItems) {
				setIsLoading(false);
				setIsSubmitting(false);
				setCartItems(reconcile(props.cartItems));
			}
		});
	});

	createEffect(() => {
		batch(() => {
			if (props.products) {
				setIsLoading(false);
				setIsSubmitting(false);
				setProducts(reconcile(props.products));
			}
		});
	});
	return <AppContext.Provider value={[]}>{props.children}</AppContext.Provider>;
}

export function useApp() {
	return useContext(AppContext);
}
