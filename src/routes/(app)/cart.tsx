import { batch, Show } from "solid-js";
import { Meta, Title, useRouteData } from "solid-start";

import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import CartPage from "~/components/CartPage";
import { getServerProductsData$ } from "~/services/ProductServices";
import { getServerCartItemsData$ } from "~/services/CartServices";
import { createServerMultiAction$ } from "solid-start/server";

export function routeData() {
	const { setProducts } = ProductContext;
	const { setCartItems } = CartContext;
	const products = getServerProductsData$();

	const cartItems = getServerCartItemsData$();

	const cartItemsData = cartItems();
	const productsData = products();

	batch(() => {
		cartItemsData && setCartItems(cartItemsData);
		productsData && setProducts(productsData);
	});

	return { products, cartItems };
}

function cart() {
	const { cartItems, products } = useRouteData<typeof routeData>();
	createServerMultiAction$;
	return (
		<>
			<Title>Cart Page</Title>
			<Meta name='description' content='My site is even better now we are on Cart Page' />
			<main class='container h-full mx-auto mt-4 flex flex-col gap-2 sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl:'>
				<div class='flex items-center gap-2'>
					<h1 class='text-2xl font-semibold p-3 lg:text-3xl'>Cart</h1>
				</div>
				<Show when={cartItems() && products()}>
					<CartPage />
				</Show>
			</main>
		</>
	);
}
export default cart;
