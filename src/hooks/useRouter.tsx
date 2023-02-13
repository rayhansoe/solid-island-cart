/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce } from "@solid-primitives/scheduled";
import NoWorkResult from "postcss/lib/no-work-result";
import { createEffect, createSignal } from "solid-js";
import { A } from "solid-start";

export default function useRouter() {
	const push = (path: string) => {
		const [isClicked, setIsClicked] = createSignal<boolean>(false);
		let aRef: HTMLAnchorElement | ((el: HTMLAnchorElement) => void) | any;
		const body = document.body;
		const newA: HTMLAnchorElement | ((el: HTMLAnchorElement) => void) | any = (
			<A class='absolute -z-10 bg-transparent opacity-0' id='' ref={aRef} href={path} />
		);

		const navigate = () => {
			aRef.click();
			setIsClicked(true);
		};

		const debouncedNavigate = debounce(navigate, 0);

		createEffect(() => {
			console.log(aRef);
			console.log(newA);
		});

		createEffect(() => {
			if (newA) {
				body.append(newA);
			}
		});

		createEffect(() => {
			if (isClicked()) {
				newA.remove();
			}
		});

		debouncedNavigate();
	};

	const refresh = () => {
		let aRef: HTMLAnchorElement | ((el: HTMLAnchorElement) => void) | any;
		const body = document.body;
		const newA: HTMLAnchorElement | ((el: HTMLAnchorElement) => void) | any = (
			<A class='absolute -z-10 bg-transparent opacity-0' ref={aRef} href='path' />
		);

		const navigate = () => aRef.click();

		const debouncedNavigate = debounce(navigate, 0);

		createEffect(() => {
			if (newA) {
				body.append(newA);
			}
		});

		debouncedNavigate();
	};
	return { push, refresh };
}
