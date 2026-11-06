import { expect, type Locator, test } from '@af/integration-testing';

// The scroll container is `popup-content`, or its parent surface when top layer is on.
const isScrollable = (popupContent: Locator) =>
	popupContent.evaluate((element) =>
		[element, element.parentElement].some(
			(node) =>
				node !== null &&
				getComputedStyle(node).overflow === 'auto' &&
				node.scrollHeight > node.clientHeight,
		),
	);

/**
 * These tests check `overflow` on the content container, which only the legacy path has. On the top
 * layer the `PopoverSurface` is the scroll container. The path-agnostic geometry checks are in
 * `popup/__tests__/playwright/fit-viewport.spec.tsx`.
 */
const featureFlag = 'platform-dst-top-layer=false';

test('should be scrollable when shouldFitViewport is true', async ({ page, skipAxeCheck }) => {
	// The example is just for tests
	skipAxeCheck();

	await page.visitExample<typeof import('../../../examples/should-fit-viewport.tsx')>(
		'design-system',
		'popup',
		'should-fit-viewport',
		{ featureFlag },
	);

	// Open popup
	await page.getByRole('button', { name: 'Popup trigger' }).click();

	await expect.poll(() => isScrollable(page.getByTestId('popup-content'))).toBe(true);
});

test('should not be scrollable when shouldFitViewport is false', async ({ page, skipAxeCheck }) => {
	// The example is just for tests
	skipAxeCheck();

	await page.visitExample<typeof import('../../../examples/should-fit-viewport.tsx')>(
		'design-system',
		'popup',
		'should-fit-viewport',
		{ featureFlag },
	);

	// Toggle should fit viewport to false
	await page.getByRole('button', { name: 'Toggle should fit viewport' }).click();

	// Open popup
	await page.getByRole('button', { name: 'Popup trigger' }).click();

	await expect(page.getByTestId('popup-content')).toBeVisible();
	await expect.poll(() => isScrollable(page.getByTestId('popup-content'))).toBe(false);
});
