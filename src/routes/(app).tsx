import type { VoidComponent } from "solid-js";
import { batch } from "solid-js";
import { Show } from "solid-js";
import { Outlet, useRouteData } from "solid-start";
import NavBar from "~/components/NavBar";
import CartContext from "~/context/CartContext";
import { getServerCartItemsData$ } from "~/services/CartServices";

export function routeData() {
	const { setCartItems } = CartContext;

	const cartItems = getServerCartItemsData$();

	const data = cartItems();

	batch(() => {
		data && setCartItems(data);
	});

	return cartItems;
}

const App: VoidComponent = () => {
	const data = useRouteData<typeof routeData>();
	return (
		<>
			<Show when={data()}>
				<NavBar />
				<Outlet />
			</Show>
		</>
	);
};
export default App;
