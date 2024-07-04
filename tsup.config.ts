import { defineConfig } from "tsup";
export default defineConfig((options) => ({
	entry: ["src"],
	outDir: "dist",
	format: ["esm", "cjs"],
	sourcemap: false,
	bundle: false,
	clean: true,
	dts: true,
	minify: !options.watch,
}));
