import { expect, test } from '@af/integration-testing';
test('visually-hidden should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'visually-hidden', 'toggle-hidden-element');

	const toggle = page.getByTestId('toggle-visually-hidden');
	const hiddenElement = page.locator('span:has-text("Hidden text")');
	let isHidden = await hiddenElement.evaluate((el) => {
		const style = getComputedStyle(el);
		return (
			style.position === 'absolute' &&
			style.clip === 'rect(1px, 1px, 1px, 1px)' &&
			style.width === '1px' &&
			style.height === '1px'
		);
	});

	expect(isHidden).toBe(true);

	await toggle.focus();
	await toggle.click();

	isHidden = await hiddenElement.evaluate((el) => {
		const style = getComputedStyle(el);
		return (
			style.position === 'absolute' &&
			style.clip === 'rect(1px, 1px, 1px, 1px)' &&
			style.width === '1px' &&
			style.height === '1px'
		);
	});

	expect(isHidden).toBe(false);
});
