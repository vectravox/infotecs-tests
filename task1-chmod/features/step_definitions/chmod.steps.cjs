const { Given, When, Then, After } = require("@cucumber/cucumber");
const { $: original$ } = require("bun");
const { expect } = require("bun:test");
const path = require("node:path");

// Disable stdout for Bun shell
const $ = (strings, ...values) => {
	return original$({ raw: strings.raw }, ...values).quiet();
};

async function createTestDir() {
	const result = await $`mktemp -d /tmp/chmod-test-XXXXXX`;
	return result.text().trim();
}

async function getFilePermissions(filePath) {
	const result = await $`stat -c "%a" ${filePath}`;
	return result.text().trim();
}

Given(
	"существует временный файл {string} с правами {int}",
	async function (filename, perms) {
		this.testDir = await createTestDir();
		const filePath = path.join(this.testDir, filename);

		await $`echo "test content" > ${filePath}`;
		await $`chmod ${perms} ${filePath}`;
	},
);

Given(
	"существует директория {string} с правами {int} и файлом {string} с правами {int}",
	async function (dirName, dirPerms, fileName, filePerms) {
		this.testDir = await createTestDir();
		const dirPath = path.join(this.testDir, dirName);
		const filePath = path.join(dirPath, fileName);

		await $`mkdir ${dirPath}`;
		await $`echo "test content" > ${filePath}`;
		await $`chmod ${dirPerms} ${dirPath}`;
		await $`chmod ${filePerms} ${filePath}`;
	},
);

When("я выполняю команду {string}", async function (command) {
		const result = await $`sh -c "${command}"`.cwd(this.testDir).nothrow();
		this.exitCode = result.exitCode;
});

Then(
	"права файла {string} должны быть {int}",
	async function (filename, expectedPerms) {
		const filePath = path.join(this.testDir, filename);
		const perms = await getFilePermissions(filePath);

		expect(perms).toBe(expectedPerms.toString());
	},
);

Then(
	"права директории {string} должны быть {int}",
	async function (dirName, expectedPerms) {
		const dirPath = path.join(this.testDir, dirName);
		const perms = await getFilePermissions(dirPath);

		expect(perms).toBe(expectedPerms.toString());
	},
);

Then("команда должна завершиться с ошибкой", function () {
	expect(this.exitCode).not.toBe(0);
});

After(async function () {
	if (this.testDir) {
		await $`rm -rf ${this.testDir}`;
	}
});
