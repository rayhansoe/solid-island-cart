import { unstable_island } from "solid-start";
import type { ProductProps } from "~/types";
import { formatCurrency } from "~/utilities/formatCurrency";

const ProductCart = unstable_island(() => import("./ProductCart"));

const ProductCard = (props: ProductProps) => {
	return (
		<li class='relative flex flex-shrink-0 flex-grow-0 flex-col items-center w-full h-full min-w-0 p-3 md:w-1/2 md:max-w-sm lg:w-1/3 lg:max-w-none xl:w-1/4'>
			<div class='relative flex flex-shrink-0 flex-grow-0 flex-col items-center w-full h-full min-w-0 shadow bg-white rounded border border-gray-300 overflow-hidden transition-all hover:shadow-lg sm:hover:scale-103 md:hover:scale-105'>
				<img class='w-full h-52 object-cover' src={props.imgUrl} alt={props.name} loading='lazy' />
				<div class='flex flex-col w-full p-4 h-auto gap-6'>
					<div class='flex justify-between items-center'>
						<span class='text-2xl truncate'>{props.name}</span>
						<span class='text-lg text-gray-600'>{formatCurrency(props.price)}</span>
					</div>
					<div class='flex justify-between items-center'>
						<span class='text-lg text-gray-700'>
							stock: <span class='text-base font-semibold'>{props.stock}</span>
						</span>
						<ProductCart id={props.id} stock={props.stock} />
					</div>
				</div>
			</div>
		</li>
	);
};
export default ProductCard;
