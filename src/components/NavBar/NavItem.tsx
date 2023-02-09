import { A, useLocation } from "solid-start";

const NavItem = (props: { children: any; path: string }) => {
	const location = useLocation();
	// const { refetchCart } = useCartContext();
	// const { refetchProduct } = useStoreContext();
	return (
		<A
			class={`flex items-center justify-center text-xl transition-transform ${
				location.pathname === props.path ? "" : "text-gray-500"
			} hover:scale-105 `}
			href={props.path}
			// onClick={async () => {
			// 	if (props.path === "/") {
			// 		await refetchCart();
			// 	}
			// 	if (props.path === "/store") {
			// 		await refetchCart();
			// 		await refetchProduct();
			// 	}
			// }}
		>
			{props.children}
		</A>
	);
};
export default NavItem;
