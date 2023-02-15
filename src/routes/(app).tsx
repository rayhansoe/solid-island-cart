import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { Outlet, useRouteData } from "solid-start";
import NavBar from "~/components/NavBar";
import { getServerCartItemsData$ } from "~/services/CartServices";

export function routeData() {
	const cartItems = getServerCartItemsData$();

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
