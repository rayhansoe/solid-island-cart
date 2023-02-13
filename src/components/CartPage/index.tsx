import { unstable_island } from "solid-start";
const DynamicCart = unstable_island(() => import("./DynamicCart"));

export default function CartPage() {
	return <DynamicCart />;
}
