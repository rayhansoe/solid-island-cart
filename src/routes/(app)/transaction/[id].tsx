import { For, Show } from "solid-js";
import type { RouteDataArgs } from "solid-start";
import { useRouteData } from "solid-start";
import { redirect } from "solid-start/server";
import { getServerProductsData$ } from "~/services/ProductServices";
import {
	getServerTransactionData$,
	getServerTransactionItemsData$,
} from "~/services/TransactionServices";

export function routeData({ params }: RouteDataArgs) {
	const products = getServerProductsData$();

	const transaction = getServerTransactionData$(params);

	const transactionItems = getServerTransactionItemsData$(params);

	return {
		transaction,
		transactionItems,
		products,
	};
}

export default function Page() {
	const { transaction, transactionItems, products } = useRouteData<typeof routeData>();
	return (
		<Show when={transaction()?.id && transactionItems()?.length && products()?.length}>
			<details>
				<summary>{JSON.stringify(transaction())}</summary>
				<For each={transactionItems()?.filter((item) => item.transactionId === transaction()?.id)}>
					{(item) => (
						<>
							<p>{JSON.stringify(products()?.find((product) => product.id === item.productId))}</p>
							<p>{JSON.stringify(item)}</p>
						</>
					)}
				</For>
			</details>
		</Show>
	);
}
