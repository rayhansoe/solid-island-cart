import { Meta, Title, useRouteData } from "solid-start";
import type { VoidComponent } from "solid-js";
import { batch } from "solid-js";
import { Show } from "solid-js";

import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import StoreSection from "~/components/StoreSection";
import { getServerProductsData$ } from "~/services/ProductServices";
import { getServerCartItemsData$ } from "~/services/CartServices";

export const dataDump = [
	{
		id: "cld6tftrb0000s7pwynpntf54",
		name: "Red Nike Flyknit",
		category: "fashion",
		stock: 9999,
		price: 100,
		imgUrl: "imgs/Red_Nike_Flyknit.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftrw000gs7pw0i5efp4n",
		name: "Banana",
		category: "Food & Beverage",
		stock: 9999,
		price: 1.05,
		imgUrl: "imgs/banana.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tfts2000is7pwujw1c3o1",
		name: "Car",
		category: "automotive",
		stock: 9999,
		price: 14000,
		imgUrl: "imgs/car.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftrb0002s7pwmwolmjao",
		name: "White T-shirt",
		category: "fashion",
		stock: 9999,
		price: 12.99,
		imgUrl: "imgs/White_T-shirt.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftrd000as7pwau139yni",
		name: "Choker Necklace Pendant",
		category: "fashion",
		stock: 9999,
		price: 24.27,
		imgUrl: "imgs/Choker_Necklace_Pendant.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftre000es7pwrk2yxlkm",
		name: "Book",
		category: "book",
		stock: 9999,
		price: 10.99,
		imgUrl: "imgs/book.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftrd0006s7pwx5ut2hv0",
		name: "Tissot T-Classic",
		category: "fashion",
		stock: 9999,
		price: 407.48,
		imgUrl: "imgs/Tissot_T-Classic.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftrb0001s7pwgup0r1mv",
		name: "Brown Bomber Jacket",
		category: "fashion",
		stock: 9999,
		price: 33.19,
		imgUrl: "imgs/Brown_Bomber_Jacket.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftre000cs7pw8dcgokvj",
		name: "Laptop",
		category: "electronic",
		stock: 9999,
		price: 1199,
		imgUrl: "imgs/laptop.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
	{
		id: "cld6tftrd0007s7pwp3z3zh4f",
		name: "Dark Casual Backpack",
		category: "fashion",
		stock: 9999,
		price: 30,
		imgUrl: "imgs/Dark_Casual_Backpack.webp",
		createdAt: new Date(),
		updatedAt: new Date(),
		popularity: 1,
	},
];

export function routeData() {
	const { setProducts } = ProductContext;
	const { setCartItems } = CartContext;

	const products = getServerProductsData$();

	const cartItems = getServerCartItemsData$();

	const cartItemsData = cartItems();
	const productsData = products();

	batch(() => {
		cartItemsData && setCartItems(cartItemsData);
		productsData && setProducts(productsData);
	});

	return { products, cartItems };
}

const App: VoidComponent = () => {
	const data = useRouteData<typeof routeData>();
	return (
		<>
			<Title>Store Page</Title>
			<Meta name='description' content='My site is even better now we are on Store Page' />
			<main class='container mx-auto mt-4 flex flex-col gap-2'>
				<div class='flex items-center gap-2'>
					<h1 class='text-3xl font-semibold p-3'>Store</h1>
				</div>
				<Show when={data.cartItems() && data.products()}>
					<StoreSection />
				</Show>
			</main>
		</>
	);
};

export default App;
