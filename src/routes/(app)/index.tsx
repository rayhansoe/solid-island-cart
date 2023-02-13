import { Meta, Title, unstable_island, useRouteData } from "solid-start";
import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { prisma } from "~/server/db/client";

import StoreSection from "~/components/StoreSection";
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

const App: VoidComponent = () => {
	const { cartItems, products } = useRouteData<typeof routeData>();
	return (
		<>
			<Title>Store Page</Title>
			<Meta name='description' content='My site is even better now we are on Store Page' />
			<Show when={cartItems() && products()}>
				<AppProvider cartItems={cartItems()} products={products()}>
					<main class='container mx-auto mt-4 flex flex-col gap-2'>
						<div class='flex items-center gap-2'>
							<h1 class='text-3xl font-semibold p-3'>Store</h1>
						</div>
						{JSON.stringify(cartItems())}
						{JSON.stringify(products())}
						{/* <StoreSection cartItems={cartItems()} products={products()} /> */}
					</main>
				</AppProvider>
			</Show>
		</>
	);
};

export default App;
