import { Show } from "solid-js";
import { unstable_island } from "solid-start";
import CartContext from "~/context/CartContext";
const Summary = unstable_island(() => import("./Summary"));

export default function SummarySection() {
	return (
		// <div class='flex w-full h-min flex-col p-3 gap-3 sticky bottom-0 bg-white md:border md:border-gray-100 md:border-opacity-90 md:w-2/5 md:top-28 md:shadow-lg md:rounded lg:text-xl lg:w-1/3'>
		// <div class='flex w-full h-min flex-col gap-3 '>
		<Summary />
		// </div>
		// </div>
	);
}
