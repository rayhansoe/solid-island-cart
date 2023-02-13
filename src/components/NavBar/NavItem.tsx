/* eslint-disable @typescript-eslint/no-explicit-any */
import { A, useLocation } from "solid-start";

const NavItem = (props: { children: any; path: string }) => {
	const location = useLocation();
	return (
		<A
			class={`flex items-center justify-center text-xl transition-transform ${
				location.pathname === props.path ? "" : "text-gray-500"
			} hover:scale-105 `}
			href={props.path}
		>
			{props.children}
		</A>
	);
};
export default NavItem;
