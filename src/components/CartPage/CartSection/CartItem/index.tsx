/* eslint-disable solid/reactivity */
import { debounce } from "@solid-primitives/scheduled";
import { batch, createEffect, createSignal, Show } from "solid-js";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import type { CartItemProps, ProductProps } from "~/types";
import { formatCurrency } from "~/utilities/formatCurrency";

export default function CartItem(props: {
	cartItemProps: CartItemProps;
	products: ProductProps[];
}) {
	const [isRemoving, setIsRemoving] = createSignal<boolean>(false);
	const [quantity, setQuantity] = createSignal<number>(props?.cartItemProps.quantity || 0);
	const {
		setCartItems,
		setIsLoading,
		handleRemoveCartItem,
		handleSetCartItemQuantityByCartItemId,
	} = CartContext;

	const { products } = ProductContext;

	const update = () => {
		if (props?.cartItemProps.id && quantity()) {
			handleSetCartItemQuantityByCartItemId(props?.cartItemProps.id, quantity());
		}
	};

	const debouncedUpdate = debounce(update, 1000);

	createEffect(() => {
		if (props?.cartItemProps.quantity) {
			setQuantity(props?.cartItemProps.quantity);
		}
	});

	const getLengthQuantity = () => quantity().toString().length;

	const inputWidth = () =>
		getLengthQuantity() === 1 ? "32" : getLengthQuantity() === 2 ? "42" : "52";

	return (
		<>
			<div class='flex flex-col'>
				<li class='flex justify-between gap-2 py-3 w-full sm:gap-4'>
					{/* Product Image */}
					<img
						class='w-2/5 h-28 object-cover rounded sm:h-32'
						loading='lazy'
						src={
							props.products?.find((product) => product.id === props?.cartItemProps.productId)
								?.imgUrl ||
							products?.find((product) => product.id === props?.cartItemProps.productId)?.imgUrl
						}
						alt={
							props.products?.find((product) => product.id === props?.cartItemProps.productId)
								?.name ||
							products?.find((product) => product.id === props?.cartItemProps.productId)?.name
						}
					/>
					<div class='flex flex-col w-3/5 justify-between items-end'>
						{/* top side */}
						<div class='flex w-full h-min justify-between'>
							{/* Left Side */}
							<div class='flex flex-col w-1/2 sm:gap-3 lg:w-2/3'>
								<span class='flex items-center gap-1 font-medium sm:text-xl'>
									{/* Product Name */}
									<p class='truncate'>
										{props.products?.find(
											(product) => product.id === props?.cartItemProps.productId
										)?.name ||
											products?.find((product) => product.id === props?.cartItemProps.productId)
												?.name}
									</p>
								</span>
								{/* Product Price */}
								<span class='text-sm text-gray-600 sm:text-base'>
									{formatCurrency(
										props.products?.find((product) => product.id === props?.cartItemProps.productId)
											?.price ||
											products?.find((product) => product.id === props?.cartItemProps.productId)
												?.price ||
											0
									)}
								</span>
							</div>

							{/* Right Side && Total Price / Product */}
							<span class='font-medium h-min sm:text-xl'>
								{formatCurrency(
									props.products?.find((product) => product.id === props?.cartItemProps.productId)
										?.price ||
										products?.find((product) => product.id === props?.cartItemProps.productId)
											?.price ||
										0 * quantity()
								)}
							</span>
						</div>

						{/* bottom side */}
						<div class='flex'>
							<Show when={props?.cartItemProps.quantity}>
								<div class='flex items-center gap-2 mb-2'>
									{/* Remove Button */}
									<button
										disabled={isRemoving() ? true : false}
										onClick={() => {
											handleRemoveCartItem(props?.cartItemProps.productId, setIsRemoving);
											batch(() => {
												setIsLoading(true);
												setCartItems((items) =>
													items.filter((item) => item.id !== props?.cartItemProps.id)
												);
											});
										}}
										class='flex items-center justify-center text-gray-400 hover:text-red-400 group disabled:hover:cursor-not-allowed disabled:hover:text-gray-400 disabled:text-gray-400'
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											stroke-width='1.5'
											stroke='currentColor'
											class='relative inline-flex w-5 h-5 sm:w-6 sm:h-6'
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
											class='hidden opacity-60 w-5 h-5 group-hover:absolute group-hover:inline-flex group-hover:animate-ping sm:w-6 sm:h-6'
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
										{/* Decrease Button */}
										<button
											disabled={quantity() === 1 ? true : false}
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
											class='flex items-center justify-center rounded-full w-6 h-6 bg-red-300 text-xl font-bold text-white hover:bg-red-400 active:bg-red-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed sm:w-7 sm:h-7'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 24 24'
												fill='currentColor'
												class='w-3 h-3 sm:w-5 sm:h-5'
											>
												<path
													fill-rule='evenodd'
													d='M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z'
													clip-rule='evenodd'
												/>
											</svg>
										</button>

										{/* Input Quantity */}
										<input
											class='custom-input-number text-sm text-center flex items-center justify-center sm:text-lg'
											style={{
												width: `${inputWidth()}px`,
											}}
											value={quantity()}
											onInput={(e) => {
												if (parseInt(e.currentTarget.value) >= quantity()) {
													e.currentTarget.value = quantity().toString();
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
											size={String(props?.cartItemProps.quantity || 0).length}
											type='number'
											min={0}
											max={
												props.products?.find(
													(product) => product.id === props?.cartItemProps.productId
												)?.stock ||
												products?.find((product) => product.id === props?.cartItemProps.productId)
													?.stock ||
												0
											}
										/>

										{/* Increase Button */}
										<button
											disabled={
												quantity() ===
												(props.products?.find(
													(product) => product.id === props?.cartItemProps.productId
												)?.stock ||
													products?.find((product) => product.id === props?.cartItemProps.productId)
														?.stock)
													? true
													: false
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
											class='flex items-center justify-center rounded-full w-6 h-6 bg-blue-500 text-xl font-bold text-white hover:bg-blue-400 active:bg-blue-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed sm:w-7 sm:h-7'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 24 24'
												fill='currentColor'
												class='w-3 h-3 sm:w-5 sm:h-5'
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
							</Show>
						</div>
					</div>
				</li>
			</div>
		</>
	);
}
