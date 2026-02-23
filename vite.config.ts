import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/soundboard/",
	plugins: [tailwindcss(), react()],
	server: {
		proxy: {
			"/api/deezer": {
				target: "https://api.deezer.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/deezer/, ""),
			},
		},
	},
});
