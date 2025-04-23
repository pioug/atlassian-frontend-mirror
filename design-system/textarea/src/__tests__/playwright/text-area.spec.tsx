import { expect, test } from '@af/integration-testing';

test('TextArea should be able to be clicked by data-testid', async ({ page }) => {
	await page.visitExample('design-system', 'textarea', 'testing');
	const textArea = page.locator('[data-testid="MyTextAreaTestId"]').first();
	await expect(textArea).toBeVisible();
	await expect(textArea).toHaveValue('I have a data-testid');
});

test.describe('Resize', () => {
	const docsText =
		'The default export of @atlaskit/textarea is a hybrid uncontrolled/controlled component; it is uncontrolled by default, but can be optionally controlled by setting the value prop. To set a default value for TextArea while leaving component uncontrolled, specify a defaultValue prop.';

	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'textarea', 'resize');
	});

	test('should not auto increase/decrease height of resize:auto textarea based on content', async ({
		page,
	}) => {
		const selector = '[data-testid="autoResizeTextArea"]';

		const textArea = page.locator(selector);
		const defaultHeight = await textArea.evaluate((el) => el.clientHeight);

		textArea.fill(docsText);
		expect(await textArea.evaluate((el) => el.clientHeight)).toBe(defaultHeight);

		textArea.clear();
		expect(await textArea.evaluate((el) => el.clientHeight)).toBe(defaultHeight);
	});

	test('should auto increase/decrease height of resize:smart(default) textarea based on content', async ({
		page,
	}) => {
		const selector = '[data-testid="smartResizeTextArea"]';

		const textArea = page.locator(selector);
		const defaultHeight = await textArea.evaluate((el) => el.clientHeight);

		textArea.fill(docsText);
		expect(await textArea.evaluate((el) => el.clientHeight)).toBeGreaterThan(defaultHeight);

		textArea.clear();
		expect(await textArea.evaluate((el) => el.clientHeight)).toBe(defaultHeight);

		// ---- Value prop change
		// Insert text
		await page.click('[data-testid="insertTextButton"]');
		expect(await textArea.evaluate((el) => el.clientHeight)).toBeGreaterThan(defaultHeight);

		textArea.clear();
		expect(await textArea.evaluate((el) => el.clientHeight)).toBe(defaultHeight);
	});
});
