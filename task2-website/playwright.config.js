import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	reporter: [["html"], ["list"]],
	use: {
		headless: true,
		viewport: { width: 1920, height: 1080 },
		baseURL: "https://infotecs.ru",
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
		},
	],
});
