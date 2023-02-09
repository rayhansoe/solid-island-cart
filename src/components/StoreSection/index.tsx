import { For, Show } from "solid-js";
import ProductContext from "~/context/ProductContext";
import ProductCard from "./ProductCard";

const StoreSection = () => {
	const { products } = ProductContext;
	return (
		<>
			<ul class='flex items-center justify-center flex-wrap w-full'>
				<Show when={products}>
					<For each={products}>{(product) => <ProductCard {...product} />}</For>
				</Show>
			</ul>
		</>
	);
};
export default StoreSection;
