import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { getProducts$ } from "~/services/ProductServices";
import type { ProductProps } from "~/types";

const data: ProductProps[] = await getProducts$();

function createProductContext() {
	const [products, setProducts] = createStore<ProductProps[]>(data || []);

	// const [productsResource, { refetch }] = createResource(loadProducts);

	const getProductClient = (id: string) => products?.find((product) => product.id === id);

	const getStockItemClient = (id: string) => products?.find((product) => product.id === id)?.stock;

	// createEffect(() => productsResource() && setProducts(productsResource()));

	return { products, setProducts, getProductClient, getStockItemClient };
}
export default createRoot(createProductContext);
