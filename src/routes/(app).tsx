import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { Outlet, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import NavBar from "~/components/NavBar";
import { prisma } from "~/server/db/client";

export function routeData() {
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

	return cartItems;
}

const App: VoidComponent = () => {
	const cartItems = useRouteData<typeof routeData>();
	return (
		<>
			<Show when={cartItems()}>
				<NavBar cartItems={cartItems()} />
				<Outlet />
			</Show>
		</>
	);
};
export default App;
