/* eslint-disable solid/reactivity */
import { debounce } from "@solid-primitives/scheduled";
import { batch, createComputed, createEffect, createSignal, Match, Switch } from "solid-js";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import type { CartItemProps } from "~/types";

type ProductCartProps = {
	id: string;
	stock: number;
	serverCartItems: CartItemProps[];
};

export default function ProductCart(props: ProductCartProps) {
	const [isIncreasing, setIsIncreasing] = createSignal<boolean>(false);
	const [isReStocking, setIsReStocking] = createSignal<boolean>(false);
	const [isRemoving, setIsRemoving] = createSignal<boolean>(false);
	const [isLocalLoading, setIsLocalLoading] = createSignal<boolean>(false);
	const {
		getCartItemClient,
		getCartItemQuantityByProductId,
		setIsLoading,
		handleIncreaseCartItem,
		handleRemoveCartItem,
		handleSetCartItemQuantityByProductId,
	} = CartContext;

	const { handleReStockProduct, getProductClient } = ProductContext;

	const getCartItemQuantityByProductIdServer = () =>
		props.serverCartItems?.find((item) => item.productId === props.id)?.quantity || 0;

	const getProductStock = () => getProductClient(props.id)?.stock || 0;

	const [cartItem, setCartItem] = createSignal(
		props.serverCartItems.find((i) => i.productId === props.id)
	);
	const [quantity, setQuantity] = createSignal<number>(getCartItemQuantityByProductIdServer());
	const [stock, setStock] = createSignal<number>(props.stock);

	const update = () => {
		handleSetCartItemQuantityByProductId(props.id, quantity(), setIsLocalLoading);
	};

	const debouncedUpdate = debounce(update, 1000);

	createComputed(() => setCartItem(props.serverCartItems.find((i) => i.productId === props.id)));

	createComputed(() => setCartItem(getCartItemClient(props.id)));

	createComputed(() =>
		setQuantity(getCartItemQuantityByProductIdServer() || getCartItemQuantityByProductId(props.id))
	);

	createEffect(() => setStock(getProductStock()));

	const getLengthQuantity = () => quantity().toString().length;

	const inputWidth = () =>
		getLengthQuantity() === 1 ? "32" : getLengthQuantity() === 2 ? "42" : "52";

	return (
		<>
			<Switch>
				<Match when={!props.stock || !stock()}>
					<button
						disabled={isReStocking() ? true : false}
						onClick={() => handleReStockProduct(props.id, setIsReStocking)}
						class='flex items-center justify-center rounded-md h-10 shadow font-semibold bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-300 py-2 px-3 disabled:bg-blue-100 disabled:text-gray-500 disabled:cursor-not-allowed'
					>
						+Restock
					</button>
				</Match>
				<Match when={cartItem()?.id}>
					<div class='flex items-center gap-2 h-10'>
						<button
							title='Remove Cart Item'
							aria-label='Remove Cart Item from Cart'
							disabled={isRemoving() ? true : false || isLocalLoading()}
							onClick={() => {
								handleRemoveCartItem(props.id, setIsRemoving);
								batch(() => {
									setIsLoading(true);
									// setCartItems((items) => items.filter((item) => item.productId !== props.id));
								});
							}}
							class='flex items-center justify-center text-gray-400 hover:text-red-400 group disabled:hover:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400 disabled:cursor-not-allowed'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke-width='1.5'
								stroke='currentColor'
								aria-hidden='true'
								class='relative inline-flex w-6 h-6'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
								/>
							</svg>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke-width='1.5'
								stroke='currentColor'
								aria-hidden='true'
								class='hidden opacity-60 w-6 h-6 group-hover:absolute group-hover:inline-flex group-hover:animate-ping'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
								/>
							</svg>
						</button>
						<span class='h-5 w-[1px] bg-gray-300' />
						<div class='flex items-center gap-2'>
							<button
								title='Decrease Cart Item'
								aria-label='Decrease Cart Item Quantity'
								disabled={quantity() === 1 || isRemoving() || isLocalLoading()}
								onClick={() => {
									batch(() => {
										setQuantity((q) => q - 1);
										setIsLoading(true);
									});
									debouncedUpdate();
								}}
								onKeyUp={(e) => {
									e.preventDefault();
								}}
								class='flex items-center justify-center rounded-full w-7 h-7 bg-red-300 text-xl font-bold text-white hover:bg-red-400 active:bg-red-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='currentColor'
									class='w-5 h-5'
									aria-hidden='true'
								>
									<path
										fill-rule='evenodd'
										d='M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z'
										clip-rule='evenodd'
									/>
								</svg>
							</button>

							<input
								class={`custom-input-number text-center flex items-center justify-center disabled:cursor-not-allowed`}
								aria-label='Cart Item Quantity'
								value={quantity()}
								disabled={isRemoving() || isLocalLoading()}
								style={{
									width: `${inputWidth()}px`,
								}}
								onInput={(e) => {
									if (parseInt(e.currentTarget.value) >= props.stock) {
										e.currentTarget.value = props.stock.toString();
									}
									batch(() => {
										setQuantity(parseInt(e.currentTarget.value));
										setIsLoading(true);
									});
									debouncedUpdate();
								}}
								onKeyUp={(e) => {
									e.preventDefault();
								}}
								size={String(quantity()).length}
								type='number'
								min={1}
								max={props.stock || getProductClient(props.id)?.stock}
							/>

							<button
								title='Increase Cart Item'
								aria-label='Increase Cart Item Quantity'
								disabled={
									quantity() === getProductClient(props.id)?.stock
										? true
										: false || isRemoving() || isLocalLoading()
								}
								onClick={() => {
									batch(() => {
										setQuantity((q) => q + 1);
										setIsLoading(true);
									});
									debouncedUpdate();
								}}
								onKeyUp={(e) => {
									e.preventDefault();
								}}
								class='flex items-center justify-center rounded-full w-7 h-7 bg-blue-500 text-xl font-bold text-white hover:bg-blue-400 active:bg-blue-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='currentColor'
									aria-hidden='true'
									class='w-5 h-5'
								>
									<path
										fill-rule='evenodd'
										d='M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z'
										clip-rule='evenodd'
									/>
								</svg>
							</button>
						</div>
					</div>
				</Match>
				<Match when={!cartItem()?.id}>
					<button
						disabled={isIncreasing() ? true : false}
						onClick={() => {
							setIsIncreasing(true);
							handleIncreaseCartItem(props.id, setIsIncreasing);
						}}
						class='flex items-center justify-center rounded-md h-10 shadow font-semibold bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-300 py-2 px-3 disabled:bg-blue-100 disabled:text-gray-500 disabled:cursor-not-allowed'
					>
						+Add to Cart
					</button>
				</Match>
			</Switch>
		</>
	);
}
