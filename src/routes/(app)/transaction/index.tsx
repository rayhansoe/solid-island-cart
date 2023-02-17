import { For, Show } from "solid-js";
import { unstable_island, useRouteData } from "solid-start";
import { getServerCartItemsData$ } from "~/services/CartServices";
import { getServerProductsData$ } from "~/services/ProductServices";
import {
	getServerTransactionsData$,
	getServerTransactionsItemsData$,
} from "~/services/TransactionServices";

const AppProvider = unstable_island(() => import("../../../context/AppProvider"));

export function routeData() {
	const transactions = getServerTransactionsData$();

	const transactionsItems = getServerTransactionsItemsData$();

	const products = getServerProductsData$();

	const cartItems = getServerCartItemsData$();

	return { transactions, transactionsItems, products, cartItems };
}

export default function Page() {
	const { transactions, transactionsItems, products, cartItems } = useRouteData<typeof routeData>();

	const getProduct = (id: string) => products()?.find((product) => product.id === id);

	return (
		<Show when={transactions()?.length && transactionsItems()?.length && products()?.length}>
			<AppProvider cartItems={cartItems()} products={products()}>
				<main class='container mx-auto mt-4 flex flex-col gap-2 px-4 sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
					<div class='flex items-center gap-2'>
						<h1 class='text-2xl font-semibold lg:text-3xl'>Transactions</h1>
					</div>
					<For each={transactions()}>
						{(transaction) => {
							return (
								<>
									<div class='flex flex-col gap-2 p-4 w-full shadow rounded my-1 border-gray-100 border hover:shadow-lg'>
										<details class='custom-details'>
											<summary
												class={`flex flex-col gap-4 w-full ${
													(transactionsItems()?.filter(
														(item) => item.transactionId === transaction.id
													).length || 0) > 1
														? "cursor-pointer"
														: ""
												}`}
											>
												<div class='flex items-center gap-4'>
													<span class='text-sm font-bold text-green-700 bg-green-200 py-1 px-2 rounded'>
														Success
													</span>
													<span class='text-sm font-medium text-gray-600'>
														{transaction.createdAt.toDateString()}
													</span>
													<span class='text-sm text-slate-500 hidden sm:block'>{`INV/${transaction.createdAt.toLocaleDateString()}/${transaction.id.toUpperCase()}`}</span>
												</div>
												<For
													each={transactionsItems()
														?.filter((item) => item.transactionId === transaction.id)
														.splice(0, 1)}
												>
													{(item) => (
														<>
															<div class='flex w-full justify-between'>
																<div class='flex gap-3 w-60 sm:w-full'>
																	<img
																		class='w-24 h-24 object-cover rounded-lg'
																		src={getProduct(item.productId)?.imgUrl || ""}
																		alt={getProduct(item.productId)?.name}
																		loading='lazy'
																	/>
																	<div class='flex flex-col gap-2 w-3/5'>
																		<span class='text-lg font-medium truncate'>
																			{getProduct(item.productId)?.name}
																		</span>
																		<p class='text-sm text-gray-600'>
																			{item.quantity}pcs * ${getProduct(item.productId)?.price}
																		</p>
																		<Show
																			when={
																				(transactionsItems()?.filter(
																					(item) => item.transactionId === transaction.id
																				).length || 0) > 1
																			}
																		>
																			<p class='text-sm text-gray-800'>{`+${
																				transaction.quantities - 1
																			} more products`}</p>
																		</Show>
																	</div>
																</div>
																<div class='flex flex-col'>
																	<span class='text-xl font-semibold'>
																		${transaction.totalPrice}
																	</span>
																</div>
															</div>
														</>
													)}
												</For>
											</summary>
										</details>
										<Show
											when={
												(transactionsItems()?.filter(
													(item) => item.transactionId === transaction.id
												).length || 0) > 1
											}
										>
											<div class='flex flex-col gap-2 h-auto max-h-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0s] details-content'>
												<span class='block h-[1px] w-full bg-gray-200 my-4' />
												<ul class='flex flex-col gap-4'>
													<For
														each={transactionsItems()?.filter(
															(item) => item.transactionId === transaction.id
														)}
													>
														{(item) => {
															const p = getProduct(item.productId);
															return (
																<>
																	{p ? (
																		<li class='flex w-full justify-between'>
																			<div class='flex gap-3 w-60 sm:w-full'>
																				<img
																					class='w-24 h-24 object-cover rounded-lg'
																					src={p.imgUrl || ""}
																					alt={p.name}
																					loading='lazy'
																				/>
																				<div class='flex flex-col gap-2 w-3/5'>
																					<span class='text-lg font-medium truncate'>{p.name}</span>
																					<p class='text-sm text-gray-600'>
																						{item.quantity}pcs * ${p.price}
																					</p>
																				</div>
																			</div>
																			<div class='flex flex-col'>
																				<span class='text-xl font-semibold'>
																					${p ? p.price * item.quantity : ""}
																				</span>
																			</div>
																		</li>
																	) : (
																		""
																	)}
																</>
															);
														}}
													</For>
												</ul>
											</div>
										</Show>
									</div>
								</>
							);
						}}
					</For>
				</main>
			</AppProvider>
		</Show>
	);
}
