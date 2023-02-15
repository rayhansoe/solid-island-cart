import solid from "solid-start/vite";
import { defineConfig } from "vite";
//
// import node from "solid-start-node";
import vercel from "solid-start-vercel";

// import netlify from "solid-start-netlify";

export default defineConfig(() => {
	return {
		plugins: [
			// solid({ islands: true, islandsRouter: true, ssr: true, adapter: node({ edge: false }) }),
			// solid({ islands: true, islandsRouter: true, ssr: true, adapter: netlify({ edge: false }) }),
			solid({ islands: true, islandsRouter: true, ssr: true, adapter: vercel({ edge: false }) }),
		],
		ssr: { external: ["@prisma/client"] },
	};
});
