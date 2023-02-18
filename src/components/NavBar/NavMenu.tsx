import { unstable_island } from "solid-start";

const NavItem = unstable_island(() => import("./NavItem"));

const NavMenu = () => {
	return (
		<ul class='flex items-center gap-6'>
			<li>
				<NavItem path='/'>Home</NavItem>
			</li>
			<li>
				<NavItem path='/cart'>Cart</NavItem>
			</li>
			<li>
				<NavItem path='/transaction'>Transaction</NavItem>
			</li>
		</ul>
	);
};
export default NavMenu;
