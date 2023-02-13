import { Show } from "solid-js";
import { A } from "solid-start";
import CartContext from "~/context/CartContext";
import CartSection from "./CartSection";
import SummarySection from "./SummarySection/(SummarySection)";

export default function DynamicCart() {
	const { cartItems, isSubmitting } = CartContext;
	return (
		<Show
			when={cartItems.length}
			fallback={
				<Show when={!isSubmitting()}>
					<div class='relative flex h-full flex-col gap-4 md:flex-row md:gap-8'>
						<div class='flex flex-col w-full py-10 mx-auto text-center gap-4 m-6 rounded-xl shadow border border-gray-200'>
							<h1 class='font-semibold text-gray-700 text-2xl md:text-5xl'>Your Cart is Empty!</h1>
							<h2 class='font-semibold text-gray-700  md:text-2xl'>
								Go Find Your Favourite Products Now.
							</h2>
							<A href='/' class='text-lg font-semibold text-blue-400 hover:underline'>
								Store!
							</A>
						</div>
					</div>
				</Show>
			}
		>
			<div class='relative flex h-full w-full flex-col gap-4 md:flex-row md:gap-8 lg:gap-14'>
				{/* Cart */}
				<div class='parent-island container flex flex-col items-center md:w-3/5 lg:w-2/3'>
					<CartSection />
				</div>

				{/* Summary Cart */}
				<div class='parent-island flex w-full h-min flex-col py-4 gap-3 sticky bottom-0 bg-white md:border md:border-gray-100 md:border-opacity-90 md:p-3 md:w-2/5 md:top-28 md:shadow-lg md:rounded lg:text-xl lg:w-1/3'>
					<SummarySection />
				</div>
			</div>
		</Show>
	);
}
