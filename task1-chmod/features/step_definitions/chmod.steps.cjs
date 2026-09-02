const { Given, When, Then, After } = require("@cucumber/cucumber");
const fs = require("node:fs").promises;
const { exec } = require("node:child_process");
const util = require("node:util");
const path = require("node:path");
const assert = require("node:assert");

const execPromise = util.promisify(exec);

let testDir = null;
let lastExitCode = 0;

async function createTestDir() {
	const tmpDir = await fs.mkdtemp("/tmp/chmod-test-");
	testDir = tmpDir;
	return tmpDir;
}

async function getFilePermissions(filePath) {
	const stats = await fs.stat(filePath);
	return (stats.mode & 0o777).toString(8);
}

Given(
	"существует временный файл {string} с правами {int}",
	async function (filename, perms) {
		const dir = await createTestDir();
		const filePath = path.join(dir, filename);
		await fs.writeFile(filePath, "test content");
		await fs.chmod(filePath, parseInt(perms, 8));
		this.filePath = filePath;
	},
);

Given(
	"существует директория {string} с файлом {string}",
	async function (dirName, fileName) {
		const dir = await createTestDir();
		const dirPath = path.join(dir, dirName);
		const filePath = path.join(dirPath, fileName);

		await fs.mkdir(dirPath, { recursive: true });
		await fs.writeFile(filePath, "test content");
		await fs.chmod(dirPath, 0o755);
		await fs.chmod(filePath, 0o644);

		this.dirPath = dirPath;
		this.filePath = filePath;
	},
);

When("я выполняю команду {string}", async (command) => {
	const cwd = testDir || ".";

	try {
		await execPromise(command, { cwd, shell: "/bin/bash" });
		lastExitCode = 0;
	} catch (error) {
		lastExitCode = error.code || 1;
	}
});

Then(
	"права файла {string} должны быть {int}",
	async (filename, expectedPerms) => {
		const filePath = path.join(testDir, filename);
		const perms = await getFilePermissions(filePath);
		assert.strictEqual(perms, expectedPerms.toString());
	},
);

Then(
	"права директории {string} должны быть {int}",
	async (dirName, expectedPerms) => {
		const dirPath = path.join(testDir, dirName);
		const perms = await getFilePermissions(dirPath);
		assert.strictEqual(perms, expectedPerms.toString());
	},
);

Then("команда должна завершиться с ошибкой", () => {
	assert.notStrictEqual(
		lastExitCode,
		0,
		"Команда должна была завершиться с ошибкой",
	);
});

After(async () => {
	if (testDir) {
		await fs.rm(testDir, { recursive: true, force: true });
		testDir = null;
	}
	lastExitCode = 0;
});
