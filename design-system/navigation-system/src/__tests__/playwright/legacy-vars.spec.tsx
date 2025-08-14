/* eslint-disable testing-library/prefer-screen-queries */
import invariant from 'tiny-invariant';

import { expect, type Locator, type Page, test } from '@af/integration-testing';

/**
 * Waits for a single frame.
 *
 * This is helpful for avoiding flake by ensuring that drag events have been processed,
 * because `pragmatic-drag-and-drop` will schedule updates into frames.
 */
async function waitForFrame(page: Page) {
	await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
}

/**
 * Drags the `locator` by the given `offset`.
 */
async function dragByOffset({
	page,
	locator,
	offset,
	shouldDrop,
}: {
	page: Page;
	locator: Locator;
	offset: {
		x: number;
		y: number;
	};
	shouldDrop: boolean;
}) {
	await locator.hover();

	const rect = await locator.boundingBox();
	invariant(rect, 'Could not obtain bounding box');

	// Start drag from top left of element
	const dragStartPosition = {
		x: rect.x,
		y: rect.y,
	};

	const dragEndPosition = {
		x: dragStartPosition.x + offset.x,
		y: dragStartPosition.y + offset.y,
	};

	await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
	await page.mouse.down();
	/**
	 * Two mouse moves are required for reliable `dragover` dispatch.
	 * https://playwright.dev/docs/input#dragging-manually
	 */
	await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
	await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
	/**
	 * Waiting for a frame so Pragmatic drag and drop events are dispatched.
	 */
	await waitForFrame(page);

	if (shouldDrop) {
		await page.mouse.up();
	}
}

const viewportSize = {
	large: {
		width: 1480,
		height: 720,
	},
	small: {
		width: 768,
		height: 720,
	},
};

/**
 * Set a consistent viewport size that's large enough that no slots are overlays.
 */
test.beforeEach(async ({ page }) => {
	await page.setViewportSize(viewportSize.large);
});

test.describe('legacy CSS variables', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'legacy-var-testing');
	});

	test('panel CSS variable updates during a drag', async ({ page }) => {
		// Only Main + Panel will be mounted
		await page.getByRole('radio', { name: 'Panel' }).click();

		const panel = page.getByRole('region', { name: 'Panel' });
		const legacyVarSpy = page.getByTestId('legacy-var-spy');

		// Width should be 350px by default (defined in the example)
		await expect(panel).toHaveWidth(350);

		// The legacy var should have the same width as the panel
		await expect(legacyVarSpy).toHaveWidth(350);

		// Resize the panel `100px` left
		await dragByOffset({
			page,
			locator: page.getByTestId('panel-slot-panel-splitter'),
			offset: { x: -100, y: 0 },
			shouldDrop: false,
		});

		// The legacy var has already been updated
		await expect(legacyVarSpy).toHaveWidth(450);

		// End the drag
		await page.mouse.up();

		// The legacy var has not changed
		await expect(legacyVarSpy).toHaveWidth(450);
	});

	test('aside CSS variable updates during a drag', async ({ page }) => {
		// Only Main + Aside will be mounted
		await page.getByRole('radio', { name: 'Aside' }).click();

		const aside = page.getByRole('complementary', { name: 'Aside' });
		const legacyVarSpy = page.getByTestId('legacy-var-spy');

		// Width should be 400px by default (defined in the example)
		await expect(aside).toHaveWidth(400);

		// The legacy var should have the same width as the aside
		await expect(legacyVarSpy).toHaveWidth(400);

		// Resize the aside `100px` left
		await dragByOffset({
			page,
			locator: page.getByTestId('aside-slot-panel-splitter'),
			offset: { x: -100, y: 0 },
			shouldDrop: false,
		});

		// The legacy var has already been updated
		await expect(legacyVarSpy).toHaveWidth(500);

		// End the drag
		await page.mouse.up();

		// The legacy var has not changed
		await expect(legacyVarSpy).toHaveWidth(500);
	});

	test('panel CSS variable resolves to 0px when it is an overlay', async ({ page }) => {
		// Small viewport so that the Panel is an overlay
		await page.setViewportSize(viewportSize.small);

		// Only Main + Panel will be mounted
		await page.getByRole('radio', { name: 'Panel' }).click();

		const panel = page.getByRole('region', { name: 'Panel' });
		const legacyVarSpy = page.getByTestId('legacy-var-spy');

		// Width should be 350px by default (defined in the example)
		await expect(panel).toHaveWidth(350);

		// The legacy var resolves to 0px because the Panel is an overlay
		await expect(legacyVarSpy).toHaveWidth(0);

		// Resize the panel `100px` left
		await dragByOffset({
			page,
			locator: page.getByTestId('panel-slot-panel-splitter'),
			offset: { x: -100, y: 0 },
			shouldDrop: false,
		});

		// The legacy var resolves to 0px because the Panel is an overlay
		await expect(legacyVarSpy).toHaveWidth(0);

		// End the drag
		await page.mouse.up();

		// The legacy var resolves to 0px because the Panel is an overlay
		await expect(legacyVarSpy).toHaveWidth(0);
	});

	test('aside CSS variable resolves to 0px when it is below main', async ({ page }) => {
		// Small viewport so that the Aside is below Main
		await page.setViewportSize(viewportSize.small);

		// Only Main + Aside will be mounted
		await page.getByRole('radio', { name: 'Aside' }).click();

		const aside = page.getByRole('complementary', { name: 'Aside' });
		const legacyVarSpy = page.getByTestId('legacy-var-spy');

		// Aside is full width because it is under main
		await expect(aside).toHaveWidth(viewportSize.small.width);

		// The legacy var resolves to 0px because Aside is under main
		await expect(legacyVarSpy).toHaveWidth(0);

		// Make the panel splitter grab-able by Playwright
		// A real user can still drag it without this
		await aside.evaluate((aside) => {
			aside.style.marginLeft = '24px';
		});

		// Resize the panel `100px` left
		// Note: resizing while aside is under main does nothing, but the splitter is still rendered
		// We can update this test if/when we remove the splitter on smaller viewports
		await dragByOffset({
			page,
			locator: page.getByTestId('aside-slot-panel-splitter'),
			offset: { x: 100, y: 0 },
			shouldDrop: false,
		});

		// The legacy var resolves to 0px because Aside is under main
		await expect(legacyVarSpy).toHaveWidth(0);

		// End the drag
		await page.mouse.up();

		// The legacy var resolves to 0px because Aside is under main
		await expect(legacyVarSpy).toHaveWidth(0);
	});

	test('sidenav CSS variable does not update until drag finishes', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'legacy-var-testing');

		// Only Main + SideNav will be mounted
		await page.getByRole('radio', { name: 'SideNav' }).click();

		const sideNav = page.getByRole('navigation', { name: 'Side navigation' });
		const legacyVarSpy = page.getByTestId('legacy-var-spy');

		// Width should be 320px by default (defined in the example)
		await expect(sideNav).toHaveWidth(320);

		// The legacy var should have the same width as the panel
		await expect(legacyVarSpy).toHaveWidth(320);

		// Resize the aside `100px` right
		await dragByOffset({
			page,
			locator: page.getByTestId('side-nav-slot-panel-splitter'),
			offset: { x: 100, y: 0 },
			shouldDrop: false,
		});

		// The legacy var has already been updated
		await expect(legacyVarSpy).toHaveWidth(420);

		// End the drag
		await page.mouse.up();

		// The legacy var has not changed
		await expect(legacyVarSpy).toHaveWidth(420);
	});

	test('sidenav CSS variable resolves to 0px when it is an overlay', async ({ page }) => {
		// Small viewport so that the SideNav is an overlay
		await page.setViewportSize(viewportSize.small);

		await page.visitExample('design-system', 'navigation-system', 'legacy-var-testing');

		// Only Main + SideNav will be mounted
		await page.getByRole('radio', { name: 'SideNav' }).click();

		const sideNav = page.getByRole('navigation', { name: 'Side navigation' });
		const legacyVarSpy = page.getByTestId('legacy-var-spy');

		await page.getByRole('button', { name: 'Expand sidebar' }).click();

		// Width should be 320px by default (defined in the example)
		await expect(sideNav).toHaveWidth(320);

		// The legacy var resolves to 0px because the SideNav is an overlay
		await expect(legacyVarSpy).toHaveWidth(0);

		// Resize the panel `100px` right
		await dragByOffset({
			page,
			locator: page.getByTestId('side-nav-slot-panel-splitter'),
			offset: { x: 100, y: 0 },
			shouldDrop: false,
		});

		// The legacy var resolves to 0px because the SideNav is an overlay
		await expect(legacyVarSpy).toHaveWidth(0);

		// End the drag
		await page.mouse.up();

		// The legacy var resolves to 0px because the SideNav is an overlay
		await expect(legacyVarSpy).toHaveWidth(0);
	});
});
