/* eslint-disable solid/reactivity */
import { debounce } from "@solid-primitives/scheduled";
import { batch, createEffect, createSignal, Match, Switch } from "solid-js";
import CartContext from "~/context/CartContext";

type ProductCartProps = {
	id: string;
	stock: number;
};

export default function ProductCart(props: ProductCartProps) {
	const {
		cartItems,
		getCartItemQuantityByProductId,
		setCartItems,
		setIsLoading,
		handleIncreaseCartItem,
		handleRemoveCartItem,
		handleSetCartItemQuantityByProductId,
	} = CartContext;

	const [quantity, setQuantity] = createSignal<number>(getCartItemQuantityByProductId(props.id));

	const update = () => {
		handleSetCartItemQuantityByProductId(props.id, quantity());
	};

	const debouncedUpdate = debounce(update, 1000);

	createEffect(() => setQuantity(getCartItemQuantityByProductId(props.id)));

	return (
		<>
			<Switch
				fallback={
					<button
						// disabled={increasing.find((msg) => msg.input)?.input ? true : false}
						onClick={() => handleIncreaseCartItem(props.id)}
						class='flex items-center justify-center rounded-md h-10 shadow font-semibold bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-300 py-2 px-3 disabled:bg-blue-100 disabled:text-gray-500 disabled:cursor-not-allowed'
					>
						+Add to Cart
					</button>
				}
			>
				<Match
					when={
						cartItems?.length && cartItems?.find((item) => item.productId === props.id)?.quantity
					}
				>
					<div class='flex items-center gap-2 h-10'>
						<button
							onClick={() => {
								handleRemoveCartItem(props.id);
								batch(() => {
									setIsLoading(true);
									setCartItems((items) => items.filter((item) => item.productId !== props.id));
								});
							}}
							class='flex items-center justify-center text-gray-400 hover:text-red-400 group'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke-width='1.5'
								stroke='currentColor'
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
								disabled={quantity() !== 1 ? false : true}
								onClick={() => {
									batch(() => {
										// setCartItems(
										// 	(item) => item.productId === props.id,
										// 	produce((item) => (item.quantity = item.quantity - 1))
										// );
										setQuantity((q) => q - 1);
										setIsLoading(true);
									});
									// debouncedDecrementUpdate(props.id, );
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
								>
									<path
										fill-rule='evenodd'
										d='M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z'
										clip-rule='evenodd'
									/>
								</svg>
							</button>

							<input
								class='custom-input-number text-center flex items-center justify-center'
								value={quantity()}
								onInput={(e) => {
									batch(() => {
										// setCartItems(
										// 	(item) => item.productId === props.id,
										// 	produce((item) => (item.quantity = parseInt(e.currentTarget.value)))
										// );
										setQuantity(parseInt(e.currentTarget.value));
										setIsLoading(true);
									});
									// debouncedInputUpdate(props.id, );
									debouncedUpdate();
								}}
								onKeyUp={(e) => {
									e.preventDefault();
								}}
								size={
									String(cartItems?.find((item) => item.productId === props.id)?.quantity || 0)
										.length
								}
								type='number'
								min={1}
								max={props.stock}
							/>

							<button
								disabled={
									cartItems?.find((item) => item.productId === props.id)?.quantity === props.stock
										? true
										: false
								}
								onClick={() => {
									batch(() => {
										// setCartItems(
										// 	(item) => item.productId === props.id,
										// 	produce((item) => (item.quantity = item.quantity + 1))
										// );
										setQuantity((q) => q + 1);
										setIsLoading(true);
									});
									// debouncedIncrementUpdate(props.id, );
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
				<Match
					when={
						!cartItems?.length && !cartItems?.find((item) => item.productId === props.id)?.quantity
					}
				>
					<button
						// disabled={increasing.find((msg) => msg.input)?.input ? true : false}
						onClick={() => handleIncreaseCartItem(props.id)}
						class='flex items-center justify-center rounded-md h-10 shadow font-semibold bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-300 py-2 px-3 disabled:bg-blue-100 disabled:text-gray-500 disabled:cursor-not-allowed'
					>
						+Add to Cart
					</button>
				</Match>
			</Switch>
		</>
	);
}
