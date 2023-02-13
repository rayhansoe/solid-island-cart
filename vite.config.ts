import solid from "solid-start/vite";
import { defineConfig } from "vite";
// @ts-expect-error no typing
import netlify from "solid-start-netlify";

export default defineConfig(() => {
	return {
		plugins: [
			solid({ islands: true, islandsRouter: true, ssr: true, adapter: netlify({ edge: false }) }),
		],
		ssr: { external: ["@prisma/client"] },
	};
});
