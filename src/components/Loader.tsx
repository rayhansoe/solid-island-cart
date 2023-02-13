import { createSignal, onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { useLocation } from "solid-start";

import nProgress from "nprogress";

export default function Loader() {
	const location = useLocation();
	const [path, setPath] = createSignal(location.pathname);

	nProgress.configure({ showSpinner: false, speed: 600 });

	const Progress = () => {
		if (!isServer) {
			nProgress.start();
		}

		onMount(async () => {
			nProgress.done();
			setPath(location.pathname);
		});

		return <></>;
	};

	// Validate with pathname
	return (
		<Show when={location.pathname !== path()}>
			<Progress />
		</Show>
	);
}
