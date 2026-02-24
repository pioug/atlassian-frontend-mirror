import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

const desktopViewport = { width: 1366, height: 768 };
// Wide viewport is required when Panel should not be an overlay
const extraWideViewport = { width: 1500, height: 768 };

test.describe('resizing', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'resizable-slots');
	});

	test.describe('side nav - mouse resizing', () => {
		test('should be resizable', async ({ page }) => {
			const sideNavPanelSplitter = page
				.getByTestId('side-nav-slot-panel-splitter')
				.and(page.locator('[draggable="true"]'));
			await sideNavPanelSplitter.waitFor();

			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });
			const sideNavRectBeforeResize = await sideNav.boundingBox();
			invariant(sideNavRectBeforeResize, 'Could not obtain bounding box from side nav');

			// Width should be 320px by default (defined in the example)
			expect(sideNavRectBeforeResize.width).toBe(320);

			// Start drag from the middle of the right edge of side nav
			const dragStartPosition = {
				x: sideNavRectBeforeResize.x + sideNavRectBeforeResize.width,
				y: sideNavRectBeforeResize.y + sideNavRectBeforeResize.height / 2,
			};

			// End drag 100px to the right (increasing width)
			const dragEndPosition = {
				x: dragStartPosition.x + 100,
				y: dragStartPosition.y,
			};

			await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
			await page.mouse.down();
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);

			/**
			 * pragmatic-drag-and-drop throttles `drag` events using requestAnimationFrame, so we need to ensure the test waits for some
			 * frames to pass before ending the drag. Otherwise, the test can be flaky - the `onDrag` callback is sometimes not called.
			 *
			 * The `stable` element state means the element has maintained the same bounding box for at least two consecutive animation frames.
			 * https://playwright.dev/docs/actionability#stable
			 * An alternative is waiting for an arbitrary amount of time, e.g. `await page.waitForTimeout(50)`
			 */
			let handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// Two mouse moves are needed to ensure the dragover event is dispatched for all browsers
			// https://playwright.dev/docs/input#dragging-manually
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
			handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// End drag
			await page.mouse.up();

			// Width should now be 420px
			await expect(sideNav).toHaveWidth(420);
		});

		test('should not be resizable past the max resize limit', async ({ page }) => {
			// We are explicitly setting the viewport size so we know the max resize bound, as it is based on the viewport width.
			await page.setViewportSize(desktopViewport);
			const expectedMaxWidth = desktopViewport.width / 2;

			const sideNavPanelSplitter = page
				.getByTestId('side-nav-slot-panel-splitter')
				.and(page.locator('[draggable="true"]'));
			await sideNavPanelSplitter.waitFor();

			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });
			const sideNavRectBeforeResize = await sideNav.boundingBox();
			invariant(sideNavRectBeforeResize, 'Could not obtain bounding box from side nav');

			// Width should be 320px by default (defined in the example)
			expect(sideNavRectBeforeResize.width).toBe(320);

			// Start drag from the middle of the right edge of side nav
			const dragStartPosition = {
				x: sideNavRectBeforeResize.x + sideNavRectBeforeResize.width,
				y: sideNavRectBeforeResize.y + sideNavRectBeforeResize.height / 2,
			};

			// Drag 500px to the right (past the max width)
			const dragEndPosition = {
				x: dragStartPosition.x + 500,
				y: dragStartPosition.y,
			};

			await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
			await page.mouse.down();
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);

			/**
			 * pragmatic-drag-and-drop throttles `drag` events using requestAnimationFrame, so we need to ensure the test waits for some
			 * frames to pass before ending the drag. Otherwise, the test can be flaky - the `onDrag` callback is sometimes not called.
			 *
			 * The `stable` element state means the element has maintained the same bounding box for at least two consecutive animation frames.
			 * https://playwright.dev/docs/actionability#stable
			 * An alternative is waiting for an arbitrary amount of time, e.g. `await page.waitForTimeout(50)`
			 */
			let handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// Two mouse moves are needed to ensure the dragover event is dispatched for all browsers
			// https://playwright.dev/docs/input#dragging-manually
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
			handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// End drag
			await page.mouse.up();

			// Width should now be at the max width
			await expect(sideNav).toHaveWidth(expectedMaxWidth);
		});

		test('should not be resizable below the min resize limit', async ({ page }) => {
			const sideNavPanelSplitter = page
				.getByTestId('side-nav-slot-panel-splitter')
				.and(page.locator('[draggable="true"]'));
			await sideNavPanelSplitter.waitFor();

			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });
			const sideNavRectBeforeResize = await sideNav.boundingBox();
			invariant(sideNavRectBeforeResize, 'Could not obtain bounding box from side nav');

			// Width should be 320px by default (defined in the example)
			expect(sideNavRectBeforeResize.width).toBe(320);

			// Start drag from the middle of the right edge of side nav
			const dragStartPosition = {
				x: sideNavRectBeforeResize.x + sideNavRectBeforeResize.width,
				y: sideNavRectBeforeResize.y + sideNavRectBeforeResize.height / 2,
			};

			// Drag 200px to the left (below the min width)
			const dragEndPosition = {
				x: dragStartPosition.x - 200,
				y: dragStartPosition.y,
			};

			await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
			await page.mouse.down();
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);

			/**
			 * pragmatic-drag-and-drop throttles `drag` events using requestAnimationFrame, so we need to ensure the test waits for some
			 * frames to pass before ending the drag. Otherwise, the test can be flaky - the `onDrag` callback is sometimes not called.
			 *
			 * The `stable` element state means the element has maintained the same bounding box for at least two consecutive animation frames.
			 * https://playwright.dev/docs/actionability#stable
			 * An alternative is waiting for an arbitrary amount of time, e.g. `await page.waitForTimeout(50)`
			 */
			let handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// Two mouse moves are needed to ensure the dragover event is dispatched for all browsers
			// https://playwright.dev/docs/input#dragging-manually
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
			handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// End drag
			await page.mouse.up();

			// Width should now be at the min width (defined in side-nav.tsx)
			await expect(sideNav).toHaveWidth(240);
		});

		test('should close any open layers from inside the side nav when resizing', async ({
			page,
		}) => {
			// Open the side nav flyout menu item
			await page.getByRole('button', { name: /Recent/ }).click();

			const flyoutMenuItemContent = page.getByRole('button', { name: /View all recent items/ });
			// The flyout menu should be visible
			await expect(flyoutMenuItemContent).toBeVisible();

			// Start drag
			const sideNavPanelSplitter = page
				.getByTestId('side-nav-slot-panel-splitter')
				.and(page.locator('[draggable="true"]'));
			await sideNavPanelSplitter.waitFor();

			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });
			const sideNavRectBeforeResize = await sideNav.boundingBox();
			invariant(sideNavRectBeforeResize, 'Could not obtain bounding box from side nav');

			// Width should be 320px by default (defined in the example)
			expect(sideNavRectBeforeResize.width).toBe(320);

			// Start drag from the middle of the right edge of side nav
			const dragStartPosition = {
				x: sideNavRectBeforeResize.x + sideNavRectBeforeResize.width,
				y: sideNavRectBeforeResize.y + sideNavRectBeforeResize.height / 2,
			};

			// End drag 100px to the right (increasing width)
			const dragEndPosition = {
				x: dragStartPosition.x + 100,
				y: dragStartPosition.y,
			};

			await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
			await page.mouse.down();
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);

			/**
			 * pragmatic-drag-and-drop throttles `drag` events using requestAnimationFrame, so we need to ensure the test waits for some
			 * frames to pass before ending the drag. Otherwise, the test can be flaky - the `onDrag` callback is sometimes not called.
			 *
			 * The `stable` element state means the element has maintained the same bounding box for at least two consecutive animation frames.
			 * https://playwright.dev/docs/actionability#stable
			 * An alternative is waiting for an arbitrary amount of time, e.g. `await page.waitForTimeout(50)`
			 */
			let handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// Two mouse moves are needed to ensure the dragover event is dispatched for all browsers
			// https://playwright.dev/docs/input#dragging-manually
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
			handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// The flyout menu should be closed, before the drag ends
			await expect(flyoutMenuItemContent).toBeHidden();

			// End drag
			await page.mouse.up();
		});

		test('should close any open layers from outside the side nav when resizing', async ({
			page,
		}) => {
			// We are explicitly setting the viewport size to extra wide, so we can prevent the `Panel` slot from
			// overlaying over the grid - otherwise it will overlay the "Open settings" button in Aside.
			await page.setViewportSize(extraWideViewport);

			// Open the dropdown menu from Aside slot
			await page.getByRole('button', { name: /Open settings/ }).click();

			// The dropdown content should now be visible
			const dropdownContent = page.getByRole('menuitem', { name: /Permissions/ });
			await expect(dropdownContent).toBeVisible();

			// Start drag
			const sideNavPanelSplitter = page
				.getByTestId('side-nav-slot-panel-splitter')
				.and(page.locator('[draggable="true"]'));
			await sideNavPanelSplitter.waitFor();

			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });
			const sideNavRectBeforeResize = await sideNav.boundingBox();
			invariant(sideNavRectBeforeResize, 'Could not obtain bounding box from side nav');

			// Width should be 320px by default (defined in the example)
			expect(sideNavRectBeforeResize.width).toBe(320);

			// Start drag from the middle of the right edge of side nav
			const dragStartPosition = {
				x: sideNavRectBeforeResize.x + sideNavRectBeforeResize.width,
				y: sideNavRectBeforeResize.y + sideNavRectBeforeResize.height / 2,
			};

			// End drag 100px to the right (increasing width)
			const dragEndPosition = {
				x: dragStartPosition.x + 100,
				y: dragStartPosition.y,
			};

			await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
			await page.mouse.down();
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);

			/**
			 * pragmatic-drag-and-drop throttles `drag` events using requestAnimationFrame, so we need to ensure the test waits for some
			 * frames to pass before ending the drag. Otherwise, the test can be flaky - the `onDrag` callback is sometimes not called.
			 *
			 * The `stable` element state means the element has maintained the same bounding box for at least two consecutive animation frames.
			 * https://playwright.dev/docs/actionability#stable
			 * An alternative is waiting for an arbitrary amount of time, e.g. `await page.waitForTimeout(50)`
			 */
			let handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// Two mouse moves are needed to ensure the dragover event is dispatched for all browsers
			// https://playwright.dev/docs/input#dragging-manually
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
			handle = await sideNavPanelSplitter.elementHandle();
			await handle?.waitForElementState('stable');

			// The dropdown content should be closed, before the drag ends
			await expect(dropdownContent).toBeHidden();

			// End drag
			await page.mouse.up();
		});
	});

	test.describe('side nav - keyboard resizing', () => {
		test('should be resizable', async ({ page }) => {
			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });

			// Width should be 320px by default (defined in the example)
			await expect(sideNav).toHaveWidth(320);

			const inputRange = page.getByRole('slider', { name: 'Resize sidebar' });
			// Increase width by 1 step (20px)
			await inputRange.press('ArrowRight');

			// Width should now be 340px
			await expect(sideNav).toHaveWidth(340);

			// Increase width by another 2 steps (40px)
			await inputRange.press('ArrowRight');
			await inputRange.press('ArrowRight');

			await expect(sideNav).toHaveWidth(380);

			// Decrease width by 4 steps
			await inputRange.press('ArrowLeft');
			await inputRange.press('ArrowLeft');
			await inputRange.press('ArrowLeft');
			await inputRange.press('ArrowLeft');

			await expect(sideNav).toHaveWidth(300);
		});

		test('should not be resizable above the max limit', async ({ page }) => {
			// We are explicitly setting the viewport size so we know the max resize bound, as it is based on the viewport width.
			await page.setViewportSize(desktopViewport);
			const maxResizeLimit = desktopViewport.width / 2;

			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });

			// Width should be 320px by default (defined in the example)
			await expect(sideNav).toHaveWidth(320);

			// The `max` limit of the slider element should be 50% of the viewport width
			const inputRange = page.getByRole('slider', { name: 'Resize sidebar' });
			// Focus on the input range to ensure the max value is calculated and updated
			await inputRange.focus();
			await expect(inputRange).toHaveAttribute('max', maxResizeLimit.toString());

			// Press the arrow key 20 times to increase the width by 400px, to attempt to go above the max width
			for (let i = 0; i < 20; i++) {
				await inputRange.press('ArrowRight');
			}

			// Width should now be 680px. The max width is 50% of the viewport width (1366 / 2 = 683), but because the range input's
			// `step` is 20px, so will not be exactly the max if it isn't divisible by 20.
			const expectedMaxWidth = maxResizeLimit - (maxResizeLimit % 20);

			await expect(sideNav).toHaveWidth(expectedMaxWidth);
		});

		test('should not be resizable below the min limit', async ({ page }) => {
			const sideNav = page.getByRole('navigation', { name: 'Side navigation' });

			// Width should be 320px by default (defined in the example)
			await expect(sideNav).toHaveWidth(320);

			// The `min` limit of the slider element should be 240 (defined in side-nav.tsx)
			const inputRange = page.getByRole('slider', { name: 'Resize sidebar' });
			// Focus on the input range to ensure the max value is calculated and updated
			await inputRange.focus();
			await expect(inputRange).toHaveAttribute('min', '240');

			// Press the arrow key 10 times to decrease the width by 200px, to attempt to go below the min width
			for (let i = 0; i < 10; i++) {
				await inputRange.press('ArrowLeft');
			}

			// Width should now be 240px (the min width). The max width is 50% of the viewport width (1366 / 2 = 683), but because the range input's
			await expect(sideNav).toHaveWidth(240);
		});

		test('should update the resize bounds and value text when the viewport is resized and the slider element is focused', async ({
			page,
		}) => {
			await page.setViewportSize(desktopViewport);
			const expectedDesktopBounds = {
				max: desktopViewport.width / 2, // This comes from the 50vw max resize bound in side-nav.tsx
				min: 240, // This comes from the 240px min resize bound in side-nav.tsx
			};

			const inputRange = page.getByRole('slider', { name: 'Resize sidebar' });
			// Focus on the input range to ensure the max value is recalculated when the viewport is resized
			await inputRange.focus();
			await expect(inputRange).toHaveAttribute('max', expectedDesktopBounds.max.toString());
			await expect(inputRange).toHaveAttribute('min', expectedDesktopBounds.min.toString());
			await expect(inputRange).toHaveAttribute('aria-valuetext', '18% width');

			// Resize the viewport to a smaller size
			const narrowViewportSize = { width: 1024, height: 768 };
			await page.setViewportSize(narrowViewportSize);
			const expectedNarrowBounds = {
				max: narrowViewportSize.width / 2,
				min: 240,
			};

			await expect(inputRange).toHaveAttribute('max', expectedNarrowBounds.max.toString());
			await expect(inputRange).toHaveAttribute('min', expectedNarrowBounds.min.toString());
			await expect(inputRange).toHaveAttribute('aria-valuetext', '29% width');

			// Blur the input range and resize back to the initial viewport size, to verify that the attributes are _not_ recalculated unless focused
			await inputRange.blur();
			await page.setViewportSize(desktopViewport);

			// Attributes should not have changed
			await expect(inputRange).toHaveAttribute('max', expectedNarrowBounds.max.toString());
			await expect(inputRange).toHaveAttribute('min', expectedNarrowBounds.min.toString());
			await expect(inputRange).toHaveAttribute('aria-valuetext', '29% width');

			// Focus on the input range, and now the attributes should be updated
			await inputRange.focus();
			await expect(inputRange).toHaveAttribute('max', expectedDesktopBounds.max.toString());
			await expect(inputRange).toHaveAttribute('min', expectedDesktopBounds.min.toString());
			await expect(inputRange).toHaveAttribute('aria-valuetext', '18% width');
		});
	});

	test.describe('aside', () => {
		test('should be resizable', async ({ page }) => {
			const asideResizeElement = page
				.getByTestId('aside-slot-panel-splitter')
				.and(page.locator('[draggable="true"]'));
			await asideResizeElement.waitFor();

			const aside = page.getByRole('complementary', { name: 'Aside' });
			const asideRectBeforeResize = await aside.boundingBox();
			invariant(asideRectBeforeResize, 'Could not obtain bounding box from aside');

			// Width should be 400px by default (defined in the example)
			expect(asideRectBeforeResize.width).toBe(400);

			// Start drag from the middle of the left edge of the aside
			const dragStartPosition = {
				x: asideRectBeforeResize.x,
				y: asideRectBeforeResize.y + asideRectBeforeResize.height / 2,
			};

			// End drag 100px to the left of start position (increasing width)
			const dragEndPosition = {
				x: dragStartPosition.x - 100,
				y: dragStartPosition.y,
			};

			await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
			await page.mouse.down();
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);

			/**
			 * pragmatic-drag-and-drop throttles `drag` events using requestAnimationFrame, so we need to ensure the test waits for some
			 * frames to pass before ending the drag. Otherwise, the test can be flaky - the `onDrag` callback is sometimes not called.
			 *
			 * The `stable` element state means the element has maintained the same bounding box for at least two consecutive animation frames.
			 * https://playwright.dev/docs/actionability#stable
			 * An alternative is waiting for an arbitrary amount of time, e.g. `await page.waitForTimeout(50)`
			 */
			let handle = await asideResizeElement.elementHandle();
			await handle?.waitForElementState('stable');

			// Two mouse moves are needed to ensure the dragover event is dispatched for all browsers
			// https://playwright.dev/docs/input#dragging-manually
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
			handle = await asideResizeElement.elementHandle();
			await handle?.waitForElementState('stable');

			// End drag
			await page.mouse.up();

			// Width should now be 500px
			await expect(aside).toHaveWidth(500);
		});
	});

	test.describe('panel', () => {
		test('should be resizable', async ({ page }) => {
			const panelResizeElement = page
				.getByTestId('panel-slot-panel-splitter')
				.and(page.locator('[draggable="true"]'));
			await panelResizeElement.waitFor();

			const panel = page.getByRole('region', { name: 'Panel' });
			const panelRectBeforeResize = await panel.boundingBox();
			invariant(panelRectBeforeResize, 'Could not obtain bounding box from panel');

			// Width should be 350px by default (defined in the example)
			expect(panelRectBeforeResize.width).toBe(350);

			// Start drag from the middle of the left edge of the panel
			const dragStartPosition = {
				x: panelRectBeforeResize.x,
				y: panelRectBeforeResize.y + panelRectBeforeResize.height / 2,
			};

			// End drag 100px to the left of start position (increasing width)
			const dragEndPosition = {
				x: dragStartPosition.x - 100,
				y: dragStartPosition.y,
			};

			await page.mouse.move(dragStartPosition.x, dragStartPosition.y);
			await page.mouse.down();
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);

			/**
			 * pragmatic-drag-and-drop throttles `drag` events using requestAnimationFrame, so we need to ensure the test waits for some
			 * frames to pass before ending the drag. Otherwise, the test can be flaky - the `onDrag` callback is sometimes not called.
			 *
			 * The `stable` element state means the element has maintained the same bounding box for at least two consecutive animation frames.
			 * https://playwright.dev/docs/actionability#stable
			 * An alternative is waiting for an arbitrary amount of time, e.g. `await page.waitForTimeout(50)`
			 */
			let handle = await panelResizeElement.elementHandle();
			await handle?.waitForElementState('stable');

			// Two mouse moves are needed to ensure the dragover event is dispatched for all browsers
			// https://playwright.dev/docs/input#dragging-manually
			await page.mouse.move(dragEndPosition.x, dragEndPosition.y);
			handle = await panelResizeElement.elementHandle();
			await handle?.waitForElementState('stable');

			// End drag
			await page.mouse.up();

			// Width should now be 450px
			await expect(panel).toHaveWidth(450);
		});
	});
});
