import { expect, test } from '@af/integration-testing';

const owner = 'div#owner-select';
const project = 'div#project-select';
const repoName = 'input[name="repo-name"]';
const accessLevel = 'input[type="checkbox"][name="access-level"]';
const includeReadme = 'div#include-readme-select';
const createRepoBtn = 'button[type="submit"]#create-repo-button';
const cancelBtn = 'button[type="button"]#create-repo-cancel';

test('Create repository form should render without errors', async ({ page }) => {
	await page.visitExample('design-system', 'form', 'create-repository');
	await expect(page.locator(owner).first()).toBeVisible();
	await expect(page.locator(project).first()).toBeVisible();
	await expect(page.locator(repoName).first()).toBeVisible();
	await expect(page.locator(accessLevel).first()).toBeVisible();
	await expect(page.locator(includeReadme).first()).toBeVisible();
	await expect(page.locator(createRepoBtn).first()).toBeVisible();
	await expect(page.locator(cancelBtn).first()).toBeVisible();
});
