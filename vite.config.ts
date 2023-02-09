import solid from "solid-start/vite";
import { defineConfig } from "vite";
// @ts-expect-error no typing
import node from "solid-start-node";
// import vercel from "solid-start-vercel";

export default defineConfig(() => {
	return {
		plugins: [
			// solid({ islands: true, islandsRouter: true, ssr: true, adapter: vercel({ edge: false }) }),
			solid({ islands: true, islandsRouter: true, ssr: true, adapter: node({ edge: false }) }),
		],
		ssr: { external: ["@prisma/client"] },
	};
});
