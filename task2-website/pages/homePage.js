export class HomePage {
	constructor(page) {
		this.page = page;
		this.aboutMenu = page
			.locator("header")
			.getByRole("link", { name: "О компании" });
	}

	async goto() {
		await this.page.goto("/");
	}

	async getAboutLinks() {
		await this.aboutMenu.hover();
		await this.page.waitForSelector('[class*="menu-content"]', {
			state: "visible",
		});

		const linkElements = await this.page
			.locator('[class*="menu-content"] a')
			.all();

		this.aboutLinks = {};
		for (const link of linkElements) {
			const text = await link.textContent();
			if (text) {
				const trimmedText = text.trim();
				this.aboutLinks[trimmedText] = link;
			}
		}
	}

	async clickAboutLink(linkText) {
		await this.aboutLinks[linkText].click();
	}
}
