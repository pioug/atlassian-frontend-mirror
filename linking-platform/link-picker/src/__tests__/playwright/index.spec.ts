import { expect, test } from '@af/integration-testing';

const testIdsToSelectors = <T extends Record<string, string>>(testIds: T): T => {
	return Object.entries(testIds).reduce(
		(acc, [key, testId]) => ({
			...acc,
			[key]: `[data-testid="${testId}"]`,
		}),
		testIds,
	);
};

// TODO: import from ../../ui/link-picker once https://hello.jira.atlassian.cloud/browse/UTEST-1230 is resolved
const testIds = testIdsToSelectors({
	linkPicker: 'link-picker',
	urlInputField: 'link-url',
	textInputField: 'link-text',
	insertButton: 'link-picker-insert-button',
	clearUrlButton: 'clear-text',
});

test('Link picker should be able to be edit link and title without plugins', async ({ page }) => {
	await page.visitExample('linking-platform', 'link-picker', 'without-plugins');

	// Type url and submit using button
	await page.locator(testIds.urlInputField).first().fill('https://google.com');
	await page.locator(testIds.textInputField).first().fill('Inserted');
	await page.locator(testIds.insertButton).first().click();

	// Open to edit link details
	await page.locator('#test-link').first().click();

	// Edit link text and submit using keyboard
	await page.locator(testIds.clearUrlButton).first().click();
	await page.locator(testIds.urlInputField).first().fill('https://atlassian.com');
	await page.locator(testIds.textInputField).first().fill('Edited');
	await page.keyboard.press('Enter');

	await expect(page.locator('#test-link').first()).toHaveText('Edited');
	await expect(page.locator('#test-link').first()).toHaveJSProperty(
		'href',
		'https://atlassian.com/',
	);
});

test('Link picker should be able to edit link and title from search results', async ({ page }) => {
	await page.visitExample('linking-platform', 'link-picker', 'basic');

	// Type url and submit using button
	await page.locator(testIds.urlInputField).first().fill('https://google.com');
	await page.locator(testIds.textInputField).first().fill('Inserted');
	await page.locator(testIds.insertButton).first().click();

	// Open to edit link details
	await page.locator('a').first().click();

	// Select new link from result list
	await page.locator(testIds.clearUrlButton).first().click();
	await page.locator(testIds.urlInputField).first().click();
	await page.keyboard.press('ArrowDown');

	// Edit link text and submit using keyboard
	const selected = await page.locator(testIds.urlInputField).first().inputValue();
	await page.locator(testIds.textInputField).first().fill('Edited');
	await page.keyboard.press('Enter');

	await expect(page.locator('a').first()).toHaveText('Edited');
	await expect(page.locator('a').first()).toHaveJSProperty('href', selected);
	await expect(page.locator('a').first()).not.toHaveJSProperty('href', 'https://google.com/');
});

test('Link picker should fire `onContentResize` callback to allow dialogue components to handle content resize and positioning', async ({
	page,
}) => {
	await page.visitExample('linking-platform', 'link-picker', 'popup-content-resize');
	const trigger = '[data-testid="trigger"]';
	const updateFnToggle = '[data-testid="provide-updateFn-toggle"]';
	await expect(page.locator(trigger).first()).toBeVisible();
	await page.locator(trigger).first().click();
	await expect(page.locator(testIds.urlInputField).first()).toBeVisible();
	await page.locator(testIds.urlInputField).first().fill('12345');
	await page.locator(updateFnToggle).first().click();
	await page.locator(trigger).first().click();
	await page.locator(testIds.urlInputField).first().fill('12345');
});
