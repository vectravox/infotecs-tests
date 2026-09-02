import { expect, test } from "@playwright/test";
import { HomePage } from "../pages/homePage.js";
import { PatentsPage } from "../pages/patentsPage.js";

let homePage;

test.beforeAll(async ({ browser }) => {
	const page = await browser.newPage();
	homePage = new HomePage(page);
	await homePage.goto();
	await homePage.getAboutLinks();
});

test.describe("infotecs.ru tests", () => {
	test('Проверка вкладок в разделе "О компании"', async () => {
		const expectedTabs = [
			"Компания «ИнфоТеКС»",
			"Экосистема ИнфоТеКС",
			"Лицензии",
			"Академия",
			"Патенты",
			"Акционерам",
			"Реквизиты",
			"Вакансии",
			"Контакты",
			"Информационные материалы",
		];

		for (const tab of expectedTabs) {
			await expect(homePage.aboutLinks[tab]).toBeVisible();
		}
	});

	test("Проверка суммы патентов", async () => {
		await homePage.clickAboutLink("Патенты");

		const patentsPage = new PatentsPage(homePage.page);
		const total = await patentsPage.getTotalPatents();
		const categoryTotals = await patentsPage.getAllCategoryCounts();

		const sum = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
		expect(total).toBe(sum);
	});
});
