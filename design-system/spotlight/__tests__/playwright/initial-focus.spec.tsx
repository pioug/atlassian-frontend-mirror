import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `Spotlight` running on the top-layer path.
 *
 * `SpotlightCard` renders a `role="dialog"` popover, so `top-layer/useInitialFocus`
 * prefers the first element with the native HTML `autofocus` attribute and
 * falls back to the first focusable element.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer-spotlight';

test.beforeEach(async ({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('Spotlight top-layer — initial focus matrix', () => {
	test('default spotlight focuses the first focusable element (dismiss control)', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/testing-initial-focus-matrix.tsx')
		>('design-system', 'spotlight', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('default-spotlight-trigger').click();

		const spotlight = page.getByTestId('default-spotlight');
		await expect(spotlight).toBeVisible();

		const dismiss = spotlight.getByRole('button', { name: /dismiss|close/i });
		await expect(dismiss).toBeFocused();
	});

	test('spotlight with native [autofocus] element focuses that element', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/testing-initial-focus-matrix.tsx')
		>('design-system', 'spotlight', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('autofocus-spotlight-trigger').click();

		await expect(page.getByTestId('autofocus-spotlight')).toBeVisible();
		await expect(page.getByTestId('autofocus-spotlight-input')).toBeFocused();
	});
});
