import { Meta, Title, unstable_island, useRouteData } from "solid-start";
import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";

import StoreSection from "~/components/StoreSection";
import { getServerProductsData$ } from "~/services/ProductServices";
import { getServerCartItemsData$ } from "~/services/CartServices";

const AppProvider = unstable_island(() => import("../../context/AppProvider"));

export function routeData() {
	const products = getServerProductsData$();

	const cartItems = getServerCartItemsData$();

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
						<StoreSection />
					</main>
				</AppProvider>
			</Show>
		</>
	);
};

export default App;
