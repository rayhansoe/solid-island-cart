import ProductContext from "~/context/ProductContext";

export default function ProductStock(props: { id: string }) {
	const { getProductClient } = ProductContext;
	return (
		<span class='text-lg text-gray-700'>
			stock: <span class='text-base font-semibold'>{getProductClient(props.id)?.stock}</span>
		</span>
	);
}
