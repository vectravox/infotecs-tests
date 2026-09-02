const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const fs = require("node:fs").promises;
const { exec } = require("node:child_process");
const util = require("node:util");
const path = require("node:path");
const assert = require("node:assert");

const execPromise = util.promisify(exec);

async function createTestDir() {
	return await fs.mkdtemp("/tmp/chmod-test-");
}

async function getFilePermissions(filePath) {
	const stats = await fs.stat(filePath);
	return (stats.mode & 0o777).toString(8);
}

Before(function () {
	this.testDir = null;
	this.exitCode = null;
});

Given(
	"существует временный файл {string} с правами {int}",
	async function (filename, perms) {
		this.testDir = await createTestDir();
		const filePath = path.join(this.testDir, filename);

		await fs.writeFile(filePath, "test content");
		await fs.chmod(filePath, parseInt(perms, 8));
	},
);

Given(
	"существует директория {string} с файлом {string}",
	async function (dirName, fileName) {
		this.testDir = await createTestDir();
		const dirPath = path.join(this.testDir, dirName);
		const filePath = path.join(dirPath, fileName);

		await fs.mkdir(dirPath, { recursive: true });
		await fs.writeFile(filePath, "test content");
		await fs.chmod(dirPath, 0o755);
		await fs.chmod(filePath, 0o644);
	},
);

When("я выполняю команду {string}", async function (command) {
	const cwd = this.testDir || ".";

	try {
		await execPromise(command, { cwd, shell: "/bin/bash" });
		this.exitCode = 0;
	} catch (error) {
		this.exitCode = error.code || 1;
	}
});

Then(
	"права файла {string} должны быть {int}",
	async function (filename, expectedPerms) {
		const filePath = path.join(this.testDir, filename);
		const perms = await getFilePermissions(filePath);
		assert.strictEqual(perms, expectedPerms.toString());
	},
);

Then(
	"права директории {string} должны быть {int}",
	async function (dirName, expectedPerms) {
		const dirPath = path.join(this.testDir, dirName);
		const perms = await getFilePermissions(dirPath);
		assert.strictEqual(perms, expectedPerms.toString());
	},
);

Then("команда должна завершиться с ошибкой", function () {
	assert.notStrictEqual(
		this.exitCode,
		0,
		"Команда должна была завершиться с ошибкой",
	);
});

After(async function () {
	if (this.testDir) {
		await fs.rm(this.testDir, { recursive: true, force: true });
		this.testDir = null;
	}
	this.exitCode = null;
});
