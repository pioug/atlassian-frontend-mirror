/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

const exampleName = 'testing-focusable-browser-edge-cases';

test.describe('focusable helpers - browser edge cases', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/141-testing-focusable-browser-edge-cases.tsx')
		>('design-system', 'top-layer', exampleName);
	});

	test('moves from a focused container to the first or last tabbable descendant', async ({
		page,
	}) => {
		const container = page.getByTestId('container-origin');
		await container.focus();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('container-first')).toBeFocused();

		await container.focus();
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('container-last')).toBeFocused();
	});

	test('does not move focus into an element with a negative tab index', async ({ page }) => {
		await page.getByTestId('negative-tab-index-before').focus();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('negative-tab-index-after')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('negative-tab-index-before')).toBeFocused();
	});

	test('skips elements hidden by display or CSS visibility', async ({ page }) => {
		await page.getByTestId('visibility-current').focus();

		await page.keyboard.press('Tab');

		await expect(page.getByTestId('visibility-next')).toBeFocused();
	});

	test('moves relative to a focused element excluded by a custom filter', async ({ page }) => {
		const origin = page.getByTestId('filter-origin');
		await origin.focus();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('filter-after')).toBeFocused();

		await origin.focus();
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('filter-before')).toBeFocused();
	});
});
