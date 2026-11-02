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

test('should be scrollable when shouldFitViewport is true', async ({ page, skipAxeCheck }) => {
	// The example is just for tests
	skipAxeCheck();

	await page.visitExample<typeof import('../../../examples/should-fit-viewport.tsx')>(
		'design-system',
		'popup',
		'should-fit-viewport',
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
	);

	// Toggle should fit viewport to false
	await page.getByRole('button', { name: 'Toggle should fit viewport' }).click();

	// Open popup
	await page.getByRole('button', { name: 'Popup trigger' }).click();

	await expect(page.getByTestId('popup-content')).toBeVisible();
	await expect.poll(() => isScrollable(page.getByTestId('popup-content'))).toBe(false);
});
