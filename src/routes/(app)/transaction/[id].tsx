import { For, Show } from "solid-js";
import type { RouteDataArgs } from "solid-start";
import { unstable_island } from "solid-start";
import { A } from "solid-start";
import { useRouteData } from "solid-start";
import { getServerCartItemsData$ } from "~/services/CartServices";
import { getServerProductsData$ } from "~/services/ProductServices";
import {
	getServerTransactionData$,
	getServerTransactionItemsData$,
} from "~/services/TransactionServices";

const AppProvider = unstable_island(() => import("../../../context/AppProvider"));

export function routeData({ params }: RouteDataArgs) {
	const products = getServerProductsData$();

	const cartItems = getServerCartItemsData$();

	const transaction = getServerTransactionData$(params);

	const transactionItems = getServerTransactionItemsData$(params);

	return {
		transaction,
		transactionItems,
		products,
		cartItems,
	};
}

export default function Page() {
	const { transaction, transactionItems, products, cartItems } = useRouteData<typeof routeData>();

	const getProduct = (id: string) => products()?.find((product) => product.id === id);

	return (
		<Show when={transaction()?.id && transactionItems()?.length && products()?.length}>
			<AppProvider cartItems={cartItems()} products={products()}>
				<div class='container mx-auto mt-4 flex flex-col gap-2 sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
					<A href='/transaction' class='hover:underline'>
						{"<"} Transactions
					</A>
					<Show
						when={
							(transactionItems()?.filter((item) => item.transactionId === transaction()?.id)
								.length || 0) > 1
						}
					>
						<input
							class='hidden'
							type='checkbox'
							name={`approach-${transaction()?.id}`}
							id={`approach-${transaction()?.id}`}
						/>
					</Show>
					<details
						class='p-4 w-full shadow rounded my-1 border-gray-100 border transition-[max-height] duration-1000 ease-in-out overflow-hidden max-h-[174px] box-border'
						open
					>
						<summary class='block list-none'>
							<label
								for={`approach-${transaction()?.id}`}
								class={`flex flex-col gap-4 w-full ${
									(transactionItems()?.filter((item) => item.transactionId === transaction()?.id)
										.length || 0) > 1
										? "cursor-pointer"
										: ""
								}`}
							>
								<div class='flex items-center gap-4'>
									<span class='text-sm font-bold text-green-700 bg-green-200 py-1 px-2 rounded'>
										Success
									</span>
									<span class='text-sm font-medium text-gray-600'>
										{transaction()?.createdAt.toDateString()}
									</span>
									<span class='text-sm text-slate-500 hidden sm:block'>{`INV/${transaction()?.createdAt.toLocaleDateString()}/${transaction()?.id.toUpperCase()}`}</span>
								</div>
								<For
									each={transactionItems()
										?.filter((item) => item.transactionId === transaction()?.id)
										.splice(0, 1)}
								>
									{(item) => {
										const p = getProduct(item.productId);
										return (
											<>
												<div class='flex w-full justify-between'>
													<div class='flex gap-3 w-60 sm:w-full'>
														<img
															class='w-24 h-24 object-cover rounded-lg'
															src={`/${p?.imgUrl}` || ""}
															alt={p?.name}
														/>
														<div class='flex flex-col gap-2 w-3/5'>
															<span class='text-lg font-medium truncate'>{p?.name}</span>
															<p class='text-sm text-gray-600'>
																{item.quantity}pcs * ${p?.price}
															</p>
															<Show
																when={
																	(transactionItems()?.filter(
																		(item) => item.transactionId === transaction()?.id
																	).length || 0) > 1
																}
															>
																<p class='text-sm text-gray-800'>{`+${
																	transaction()?.quantities || 0 - 1
																} more products`}</p>
															</Show>
														</div>
													</div>
													<div class='flex flex-col'>
														<span class='text-xl font-semibold'>${transaction()?.totalPrice}</span>
													</div>
												</div>
											</>
										);
									}}
								</For>
							</label>
						</summary>
						<Show
							when={
								(transactionItems()?.filter((item) => item.transactionId === transaction()?.id)
									.length || 0) > 1
							}
						>
							<span class='block h-[1px] w-full bg-gray-200 my-4' />
							<ul class='flex flex-col gap-4'>
								<For
									each={transactionItems()?.filter(
										(item) => item.transactionId === transaction()?.id
									)}
								>
									{(item) => {
										const p = getProduct(item.productId);
										return (
											<li class='flex w-full justify-between'>
												<div class='flex gap-3 w-60 sm:w-full'>
													<img
														class='w-24 h-24 object-cover rounded-lg'
														src={`/${p?.imgUrl}` || ""}
														alt={p?.name}
														loading='lazy'
													/>
													<div class='flex flex-col gap-2 w-3/5'>
														<span class='text-lg font-medium truncate'>{p?.name}</span>
														<p class='text-sm text-gray-600'>
															{item.quantity}pcs * ${p?.price}
														</p>
													</div>
												</div>
												<div class='flex flex-col'>
													<span class='text-xl font-semibold'>
														${p?.price || 0 * item.quantity}
													</span>
												</div>
											</li>
										);
									}}
								</For>
							</ul>
						</Show>
					</details>
				</div>
			</AppProvider>
		</Show>
	);
}
