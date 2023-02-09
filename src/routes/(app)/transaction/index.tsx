import { batch, For, Show } from "solid-js";
import { useRouteData } from "solid-start";
import ProductContext from "~/context/ProductContext";
import TransactionContext from "~/context/TransactionContext";
import { getServerProductsData$ } from "~/services/ProductServices";
import {
	getServerTransactionsData$,
	getServerTransactionsItemsData$,
} from "~/services/TransactionServices";

export function routeData() {
	const { setProducts } = ProductContext;
	const { setTransactions, setTransactionItems } = TransactionContext;

	const transactions = getServerTransactionsData$();

	const transactionsItems = getServerTransactionsItemsData$();

	const products = getServerProductsData$();

	const transactionsData = transactions();
	const transactionItemsData = transactionsItems();
	const productsData = products();

	batch(() => {
		transactionsData && setTransactions(transactionsData);
		transactionItemsData && setTransactionItems(transactionItemsData);
		productsData && setProducts(productsData);
	});

	return { transactions, transactionsItems, products };
}

export default function Page() {
	const { transactions, transactionsItems, products } = useRouteData<typeof routeData>();
	return (
		<Show when={transactions()?.length && transactionsItems()?.length && products()?.length}>
			<For each={transactions()}>
				{(transaction) => (
					<details>
						<summary>{JSON.stringify(transaction)}</summary>
						<For
							each={transactionsItems()?.filter((item) => item.transactionId === transaction.id)}
						>
							{(item) => (
								<>
									<p>
										{JSON.stringify(products()?.find((product) => product.id === item.productId))}
									</p>
									<p>{JSON.stringify(item)}</p>
								</>
							)}
						</For>
					</details>
				)}
			</For>
		</Show>
	);
}
