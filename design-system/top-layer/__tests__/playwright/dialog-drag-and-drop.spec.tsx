/* eslint-disable testing-library/prefer-screen-queries */
/* eslint playwright/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectDialogOpen", "expectPopoverOpen", "expectDragging", "expectDragFinished", "expectDraggedOver", "expectDropRecorded"] }] */
import { expect, type Page, test } from '@af/integration-testing';

import {
	dragOver,
	drop,
	expectDragFinished,
	expectDraggedOver,
	expectDragging,
	expectDropRecorded,
	startDrag,
} from './drag-and-drop-utils';

/**
 * Does Pragmatic drag and drop work inside a top-layer `Dialog` (a native modal
 * `<dialog>`), and across the boundary between that dialog and a `Popover`
 * opened from inside it?
 */

const dropTargetTestIds = ['dialog-drop-target', 'popover-drop-target'] as const;

async function visitFixture({ page }: { page: Page }): Promise<void> {
	await page.visitExample<typeof import('../../examples/159-testing-dialog-drag-and-drop.tsx')>(
		'design-system',
		'top-layer',
		'testing-dialog-drag-and-drop',
	);
}

async function expectDialogOpen({ page }: { page: Page }): Promise<void> {
	await expect(page.getByTestId('dialog-open-state')).toHaveText('true');

	const dialog = page.getByTestId('dialog');
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAttribute('open', '');
}

/**
 * Asserts the popover is open in React state AND in the browser's top layer,
 * then waits for it to be positioned.
 *
 * The positioning wait matters because the drag helpers press at coordinates
 * read from `boundingBox()`. On the JavaScript fallback path the popover sits
 * at `opacity: 0` at its unpositioned origin until an async measure completes,
 * and `toBeVisible()` ignores opacity.
 */
async function expectPopoverOpen({ page }: { page: Page }): Promise<void> {
	await expect(page.getByTestId('popover-open-state')).toHaveText('true');

	const popover = page.getByTestId('popover');
	await expect(popover).toBeVisible();

	const isInTopLayer = await popover.evaluate((element) => element.matches(':popover-open'));
	expect(isInTopLayer).toBe(true);

	await page.waitForFunction(() => {
		const host = document.querySelector('[data-testid="popover"]');
		if (!host) {
			return false;
		}
		return window.getComputedStyle(host).opacity === '1';
	});
}

async function openDialog({ page }: { page: Page }): Promise<void> {
	await page.getByTestId('dialog-trigger').click();

	await expectDialogOpen({ page });
	await expect(page.getByTestId('dialog-card')).toBeVisible();
}

async function openPopover({ page }: { page: Page }): Promise<void> {
	await page.getByTestId('popover-trigger').click();

	await expectPopoverOpen({ page });
	await expectDialogOpen({ page });
}

test.describe('Dialog - Pragmatic drag and drop', () => {
	test('a drag and drop operation completes inside the dialog', async ({ page }) => {
		await visitFixture({ page });
		await openDialog({ page });

		await startDrag({ page, source: page.getByTestId('dialog-card') });

		await expectDragging({ page, sourceTestId: 'dialog-card' });

		await dragOver({ page, target: page.getByTestId('dialog-drop-target') });

		await expectDraggedOver({ page, testId: 'dialog-drop-target' });
		await expectDialogOpen({ page });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'dialog',
			testId: 'dialog-drop-target',
			// The popover is closed, so its drop target is not in the DOM.
			dropTargetTestIds: ['dialog-drop-target'],
		});
		await expectDialogOpen({ page });
	});

	test('a drag out of a popover in the dialog and into the dialog dismisses neither', async ({
		page,
	}) => {
		await visitFixture({ page });
		await openDialog({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('popover-card') });

		await expectDragging({ page, sourceTestId: 'popover-card' });

		await dragOver({ page, target: page.getByTestId('dialog-drop-target') });

		await expectDraggedOver({ page, testId: 'dialog-drop-target' });
		await expectDialogOpen({ page });
		await expectPopoverOpen({ page });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'popover',
			testId: 'dialog-drop-target',
			dropTargetTestIds,
		});
		await expectDialogOpen({ page });
		await expectPopoverOpen({ page });
	});

	test('a drag out of the dialog and into a popover in the dialog dismisses neither', async ({
		page,
	}) => {
		await visitFixture({ page });
		await openDialog({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('dialog-card') });

		await expectDragging({ page, sourceTestId: 'dialog-card' });

		await dragOver({ page, target: page.getByTestId('popover-drop-target') });

		await expectDraggedOver({ page, testId: 'popover-drop-target' });
		await expectDialogOpen({ page });
		await expectPopoverOpen({ page });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'dialog',
			testId: 'popover-drop-target',
			dropTargetTestIds,
		});
		await expectDialogOpen({ page });
		await expectPopoverOpen({ page });
	});
});
