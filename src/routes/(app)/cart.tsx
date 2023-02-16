import { Show } from "solid-js";
import { Meta, Title, unstable_island, useRouteData } from "solid-start";

import CartPage from "~/components/CartPage";
import { prisma } from "~/server/db/client";
import { getServerProductsData$ } from "~/services/ProductServices";
import { getServerCartItemsData$ } from "~/services/CartServices";
import { createServerData$ } from "solid-start/server";

const AppProvider = unstable_island(() => import("../../context/AppProvider"));

export function routeData() {
	const products = createServerData$(
		async () => {
			return await prisma.product.findMany({
				orderBy: {
					popularity: "desc",
				},
				select: {
					id: true,
					name: true,
					category: true,
					stock: true,
					price: true,
					imgUrl: true,
					popularity: true,
				},
			});
		},
		{
			deferStream: true,
		}
	);

	const cartItems = createServerData$(
		async () => {
			const cartItems = await prisma.cartItem.findMany({
				select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
			});

			return cartItems;
		},
		{
			deferStream: true,
		}
	);

	return { products, cartItems };
}

function cart() {
	const { cartItems, products } = useRouteData<typeof routeData>();
	return (
		<>
			<Title>Cart Page</Title>
			<Meta name='description' content='My site is even better now we are on Cart Page' />
			<AppProvider cartItems={cartItems()} products={products()}>
				<main class='container h-full mx-auto mt-4 flex flex-col px-4 gap-2 sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
					<div class='flex items-center gap-2'>
						<h1 class='text-2xl font-semibold lg:text-3xl'>Cart</h1>
					</div>
					<Show when={cartItems() && products()}>
						<CartPage cartItems={cartItems()} products={products()} />
					</Show>
				</main>
			</AppProvider>
		</>
	);
}
export default cart;
