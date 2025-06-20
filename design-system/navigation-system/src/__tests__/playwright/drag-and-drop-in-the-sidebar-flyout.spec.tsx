/**
 * We have chosen to test this behaviour in browser in order to increase our
 * confidence that our handling of browser events and their timings is correct.
 *
 * Note: an erroneous "mouseleave" event is fired after the drag starts (browser bug).
 * After that point the honey pot fix absorbs all the incorrect mouse events.
 */

import invariant from 'tiny-invariant';

import { expect, type Page, test } from '@af/integration-testing';

import { sideNavFlyoutCloseDelayMs } from '../../ui/page-layout/side-nav/flyout-close-delay-ms';

/**
 * Drag to a `box` in a way that works for all browsers.
 * Assumes a drag has already started.
 */
async function safeDragMoveToBox({
	page,
	box,
}: {
	page: Page;
	box: { x: number; y: number; width: number; height: number };
}) {
	invariant(
		box.width >= 2 && box.height >= 2,
		'safeMoveToBox can only work with boxes 2x2 or bigger',
	);

	await page.mouse.move(box.x + 1, box.y + 1);

	// Second movement needed for Firefox
	await page.mouse.move(box.x + 2, box.y + 2);
}

test.describe('drag and drop in the sidebar flyout', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample(
			'design-system',
			'navigation-system',
			'drag-and-drop-in-the-sidebar-flyout',
		);
	});
	test('the flyout should stay open if dropped inside it', async ({ page }) => {
		const toggle = page.getByTestId('side-nav-toggle-button');

		// Hover over the toggle to show the flyout
		await toggle.hover();

		// Expecting the flyout side nav is now shown
		const sideNav = page.getByTestId('side-nav');
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');

		// Wait for the flyout "expand" animation to have finished.
		// The `stable` element state means the element has maintained the
		// same bounding box for at least two consecutive animation frames.
		// https://playwright.dev/docs/actionability#stable
		let sideNavHandle = await sideNav.elementHandle();
		await sideNavHandle?.waitForElementState('stable');

		// Get our draggable element
		const draggable = page.getByTestId('draggable-menu-item-button');
		const draggableBox = await draggable.boundingBox();
		invariant(draggableBox);

		// Get our drop target
		const dropTarget = page.getByTestId('side-nav-drop-target');
		await expect(dropTarget).toHaveAttribute('data-state', 'idle');
		const dropTargetBox = await dropTarget.boundingBox();
		invariant(dropTargetBox);

		// Start a drag
		await page.mouse.move(draggableBox.x + 1, draggableBox.y + 1);
		await page.mouse.down();
		await page.mouse.move(draggableBox.y + 10, draggableBox.y + 1);

		// Drag over the drop target
		await safeDragMoveToBox({ page, box: dropTargetBox });

		await expect(dropTarget).toHaveAttribute('data-state', 'is-over');

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Assert the flyout is still visible
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');
		await expect(dropTarget).toHaveAttribute('data-state', 'is-over');

		// Finish the drop
		await page.mouse.up();
		await expect(dropTarget).toHaveAttribute('data-state', 'idle');

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Assert the flyout is still visible
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');
	});

	test('the flyout should close if dropped outside it', async ({ page }) => {
		const toggle = page.getByTestId('side-nav-toggle-button');

		// Hover over the toggle to show the flyout
		await toggle.hover();

		// Expecting the flyout side nav is now shown
		const sideNav = page.getByTestId('side-nav');
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');

		// Wait for the flyout "expand" animation to have finished.
		// The `stable` element state means the element has maintained the
		// same bounding box for at least two consecutive animation frames.
		// https://playwright.dev/docs/actionability#stable
		let sideNavHandle = await sideNav.elementHandle();
		await sideNavHandle?.waitForElementState('stable');

		// Get our draggable element
		const draggable = page.getByTestId('draggable-menu-item-button');
		const draggableBox = await draggable.boundingBox();
		invariant(draggableBox);

		// Get our drop target
		const dropTarget = page.getByTestId('panel-drop-target');
		await expect(dropTarget).toHaveAttribute('data-state', 'idle');
		const dropTargetBox = await dropTarget.boundingBox();
		invariant(dropTargetBox);

		// Start a drag
		await page.mouse.move(draggableBox.x + 1, draggableBox.y + 1);
		await page.mouse.down();
		await page.mouse.move(draggableBox.y + 10, draggableBox.y + 1);

		// Drag over the drop target
		await safeDragMoveToBox({ page, box: dropTargetBox });
		await expect(dropTarget).toHaveAttribute('data-state', 'is-over');

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Assert the flyout is still visible
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');
		await expect(dropTarget).toHaveAttribute('data-state', 'is-over');

		// Finish the drop
		await page.mouse.up();
		await expect(dropTarget).toHaveAttribute('data-state', 'idle');

		// Flyout should now close after a timeout
		await expect(sideNav).toHaveAttribute('data-visible', 'false');
	});

	test('the flyout should stay open when outside the flyout if the drag started inside the flyout', async ({
		page,
	}) => {
		const toggle = page.getByTestId('side-nav-toggle-button');

		// Hover over the toggle to show the flyout
		await toggle.hover();

		// Expecting the flyout side nav is now shown
		const sideNav = page.getByTestId('side-nav');
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');

		// Wait for the flyout "expand" animation to have finished.
		// The `stable` element state means the element has maintained the
		// same bounding box for at least two consecutive animation frames.
		// https://playwright.dev/docs/actionability#stable
		let sideNavHandle = await sideNav.elementHandle();
		await sideNavHandle?.waitForElementState('stable');

		// Get our draggable element
		const draggable = page.getByTestId('draggable-menu-item-button');
		const draggableBox = await draggable.boundingBox();
		invariant(draggableBox);

		// Get our side nav drop target
		const sideNavDropTarget = page.getByTestId('side-nav-drop-target');
		await expect(sideNavDropTarget).toHaveAttribute('data-state', 'idle');
		const sideNavDropTargetBox = await sideNavDropTarget.boundingBox();
		invariant(sideNavDropTargetBox);

		const panelDropTarget = page.getByTestId('panel-drop-target');
		await expect(panelDropTarget).toHaveAttribute('data-state', 'idle');
		const panelDropTargetBox = await panelDropTarget.boundingBox();
		invariant(panelDropTargetBox);

		// Start a drag
		await page.mouse.move(draggableBox.x + 1, draggableBox.y + 1);
		await page.mouse.down();
		await page.mouse.move(draggableBox.y + 10, draggableBox.y + 1);

		// Drag over panel panel drop target
		await safeDragMoveToBox({ page, box: panelDropTargetBox });
		await expect(panelDropTarget).toHaveAttribute('data-state', 'is-over');
		await expect(sideNavDropTarget).toHaveAttribute('data-state', 'idle');

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Assert the flyout is still visible
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');

		// Drag back over the sidebar
		await safeDragMoveToBox({ page, box: sideNavDropTargetBox });
		await expect(sideNavDropTarget).toHaveAttribute('data-state', 'is-over');
		await expect(panelDropTarget).toHaveAttribute('data-state', 'idle');

		// Finish the drop
		await page.mouse.up();
		await expect(sideNavDropTarget).toHaveAttribute('data-state', 'idle');
		await expect(panelDropTarget).toHaveAttribute('data-state', 'idle');

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Assert the flyout is still visible
		await expect(sideNav).toHaveAttribute('data-visible', 'flyout');
	});
});
