import CartSection from "./CartSection";
import SummarySection from "./SummarySection/(SummarySection)";

export default function CartPage() {
	return (
		<div class='relative flex h-full flex-col gap-4 md:flex-row md:gap-8 lg:gap-14'>
			{/* Cart */}
			<ul class='parent-island container flex flex-col items-center md:w-3/5 lg:w-2/3'>
				<CartSection />
			</ul>

			{/* Summary Cart */}
			<div class='parent-island flex w-full h-min flex-col p-3 gap-3 sticky bottom-0 bg-white md:border md:border-gray-100 md:border-opacity-90 md:w-2/5 md:top-28 md:shadow-lg md:rounded lg:text-xl lg:w-1/3'>
				<SummarySection />
			</div>
		</div>
	);
}
