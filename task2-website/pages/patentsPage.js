export class PatentsPage {
	constructor(page) {
		this.page = page;

		const categoryNames = [
			"Патенты РФ на изобретения",
			"Свидетельства на продукты",
			"Свидетельства на товарные знаки",
			"Патенты РФ на промышленные образцы",
		];

		this.categoryCounts = {};
		for (const name of categoryNames) {
			this.categoryCounts[name] = page.locator(
				`button:has-text("${name}") [class*="count"]`,
			);
		}

		this.totalPatents = page.locator('[class*="title-count"]');
	}

	async getTotalPatents() {
		const text = await this.totalPatents.textContent();
		return this.extractNumber(text);
	}

	async getAllCategoryCounts() {
		const values = {};
		for (const [name, locator] of Object.entries(this.categoryCounts)) {
			const text = await locator.textContent();
			values[name] = this.extractNumber(text);
		}
		return values;
	}

	extractNumber(text) {
		return parseInt(text.replace(/\D/g, ""), 10) || 0;
	}
}
