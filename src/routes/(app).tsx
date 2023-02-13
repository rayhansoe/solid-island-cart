import type { VoidComponent } from "solid-js";
import { batch } from "solid-js";
import { Show } from "solid-js";
import { Outlet, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import NavBar from "~/components/NavBar";
import CartContext from "~/context/CartContext";
import { getServerCartItemsData$ } from "~/services/CartServices";
import { prisma } from "~/server/db/client";

export function routeData() {
	const { setCartItems } = CartContext;

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

	const data = cartItems();

	batch(() => {
		data && setCartItems(data);
	});

	return cartItems;
}

const App: VoidComponent = () => {
	const cartItems = useRouteData<typeof routeData>();
	return (
		<>
			<Show when={cartItems()}>
				{JSON.stringify(cartItems())}
				{/* <NavBar cartItems={cartItems()} /> */}
				<Outlet />
			</Show>
		</>
	);
};
export default App;
