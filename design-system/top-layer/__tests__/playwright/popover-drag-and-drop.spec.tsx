/* eslint-disable testing-library/prefer-screen-queries */
/* eslint playwright/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectPopoverOpen", "expectPopoverClosed", "expectDragging", "expectDragFinished", "expectDraggedOver", "expectPointerOver", "expectDropRecorded", "expectNoDropRecorded"] }] */
import { expect, type Page, test } from '@af/integration-testing';

import {
	dragOver,
	drop,
	expectDragFinished,
	expectDraggedOver,
	expectDragging,
	expectDropRecorded,
	expectNoDropRecorded,
	expectPointerOver,
	startDrag,
} from './drag-and-drop-utils';

/**
 * Does a Pragmatic drag and drop operation light dismiss a `mode="auto"`
 * Popover?
 *
 * Native light dismiss is a two part gesture: the browser records which popover
 * the pointer went down in, and only hides popovers on the matching
 * `pointerup`. A native HTML5 drag replaces that `pointerup` with `drop` and
 * `dragend`, so the gesture never completes. Each test arranges the press, the
 * movement and the release differently relative to the popover surfaces.
 */

const dropTargetTestIdsWithoutNested = ['outside-drop-target', 'inside-drop-target'] as const;

// The nested drop target is only in the DOM while the nested popover is open.
const dropTargetTestIdsWithNested = [
	...dropTargetTestIdsWithoutNested,
	'nested-drop-target',
] as const;

type TPopoverName = 'popover' | 'nested-popover';

async function visitFixture({ page }: { page: Page }): Promise<void> {
	await page.visitExample<typeof import('../../examples/158-testing-popover-drag-and-drop.tsx')>(
		'design-system',
		'top-layer',
		'testing-popover-drag-and-drop',
	);
}

/**
 * Asserts a popover is open in React state AND in the browser's top layer, then
 * waits for it to be positioned.
 *
 * The positioning wait matters because the drag helpers press at coordinates
 * read from `boundingBox()`. On the JavaScript fallback path the popover sits
 * at `opacity: 0` at its unpositioned origin until an async measure completes,
 * and `toBeVisible()` ignores opacity.
 */
async function expectPopoverOpen({
	page,
	name,
}: {
	page: Page;
	name: TPopoverName;
}): Promise<void> {
	await expect(page.getByTestId(`${name}-open-state`)).toHaveText('true');

	const popover = page.getByTestId(name);
	await expect(popover).toBeVisible();

	const isInTopLayer = await popover.evaluate((element) => element.matches(':popover-open'));
	expect(isInTopLayer).toBe(true);

	await page.waitForFunction((testId) => {
		const host = document.querySelector(`[data-testid="${testId}"]`);
		if (!host) {
			return false;
		}
		return window.getComputedStyle(host).opacity === '1';
	}, name);
}

async function expectPopoverClosed({
	page,
	name,
}: {
	page: Page;
	name: TPopoverName;
}): Promise<void> {
	await expect(page.getByTestId(`${name}-open-state`)).toHaveText('false');
	await expect(page.getByTestId(name)).toBeHidden();
}

async function openPopover({ page }: { page: Page }): Promise<void> {
	await page.getByTestId('popover-trigger').click();

	await expectPopoverOpen({ page, name: 'popover' });
}

async function openNestedPopover({ page }: { page: Page }): Promise<void> {
	await page.getByTestId('nested-popover-trigger').click();

	await expectPopoverOpen({ page, name: 'nested-popover' });
	await expectPopoverOpen({ page, name: 'popover' });
}

test.describe('Popover is not light dismissed by a drag and drop operation', () => {
	/**
	 * The negative control. Without it every other test in this file would still
	 * pass if the fixture stopped being dismissible at all, for example if the
	 * popover became `mode="manual"` or a layout regression put its surface
	 * underneath the outside column.
	 */
	test('a plain press and release outside the popover DOES dismiss it', async ({ page }) => {
		await visitFixture({ page });
		await openPopover({ page });

		await page.getByTestId('outside-drop-target').click();

		await expectPopoverClosed({ page, name: 'popover' });
	});

	test('a drag between two elements outside the popover does not dismiss it', async ({ page }) => {
		await visitFixture({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('outside-card') });

		await expectDragging({ page, sourceTestId: 'outside-card' });

		await dragOver({ page, target: page.getByTestId('outside-drop-target') });

		await expectDraggedOver({ page, testId: 'outside-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'outside',
			testId: 'outside-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithoutNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
	});

	test('a drag from outside the popover onto the popover does not dismiss it', async ({ page }) => {
		await visitFixture({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('outside-card') });

		await expectDragging({ page, sourceTestId: 'outside-card' });

		await dragOver({ page, target: page.getByTestId('inside-drop-target') });

		await expectDraggedOver({ page, testId: 'inside-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'outside',
			testId: 'inside-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithoutNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
	});

	test('a drag from inside the popover to outside it does not dismiss it', async ({ page }) => {
		await visitFixture({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('inside-card') });

		await expectDragging({ page, sourceTestId: 'inside-card' });

		await dragOver({ page, target: page.getByTestId('outside-drop-target') });

		await expectDraggedOver({ page, testId: 'outside-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'inside',
			testId: 'outside-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithoutNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
	});

	test('a drag contained inside the popover does not dismiss it', async ({ page }) => {
		await visitFixture({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('inside-card') });

		await expectDragging({ page, sourceTestId: 'inside-card' });

		await dragOver({ page, target: page.getByTestId('inside-drop-target') });

		await expectDraggedOver({ page, testId: 'inside-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'inside',
			testId: 'inside-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithoutNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
	});

	test('a drag released over nothing does not dismiss the popover', async ({ page }) => {
		await visitFixture({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('inside-card') });

		await expectDragging({ page, sourceTestId: 'inside-card' });

		// `empty-space` is not a drop target, so this release fires `dragend`
		// without a `drop`.
		const point = await dragOver({ page, target: page.getByTestId('empty-space') });

		await expectPointerOver({ page, point, testId: 'empty-space' });
		await expectPopoverOpen({ page, name: 'popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectNoDropRecorded({
			page,
			dropTargetTestIds: dropTargetTestIdsWithoutNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
	});

	test('a drag cancelled with escape does not drop, and does not dismiss the popover', async ({
		page,
	}) => {
		await visitFixture({ page });
		await openPopover({ page });

		await startDrag({ page, source: page.getByTestId('inside-card') });

		await expectDragging({ page, sourceTestId: 'inside-card' });

		await dragOver({ page, target: page.getByTestId('outside-drop-target') });

		await expectDraggedOver({ page, testId: 'outside-drop-target' });

		// Escape cancels a native drag, and is also what dismisses an `auto`
		// popover. This checks which one consumes the key.
		await page.keyboard.press('Escape');

		await expectDragFinished({ page });
		await expectNoDropRecorded({
			page,
			dropTargetTestIds: dropTargetTestIdsWithoutNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });

		await drop({ page });
	});

	test('a drag from the popover into the nested popover dismisses neither', async ({ page }) => {
		await visitFixture({ page });
		await openPopover({ page });
		await openNestedPopover({ page });

		await startDrag({ page, source: page.getByTestId('inside-card') });

		await expectDragging({ page, sourceTestId: 'inside-card' });

		await dragOver({ page, target: page.getByTestId('nested-drop-target') });

		await expectDraggedOver({ page, testId: 'nested-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'inside',
			testId: 'nested-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });
	});

	test('a drag from the nested popover back into the parent popover dismisses neither', async ({
		page,
	}) => {
		await visitFixture({ page });
		await openPopover({ page });
		await openNestedPopover({ page });

		await startDrag({ page, source: page.getByTestId('nested-card') });

		await expectDragging({ page, sourceTestId: 'nested-card' });

		await dragOver({ page, target: page.getByTestId('inside-drop-target') });

		await expectDraggedOver({ page, testId: 'inside-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'nested',
			testId: 'inside-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });
	});

	test('a drag from the nested popover to outside every popover dismisses neither', async ({
		page,
	}) => {
		await visitFixture({ page });
		await openPopover({ page });
		await openNestedPopover({ page });

		await startDrag({ page, source: page.getByTestId('nested-card') });

		await expectDragging({ page, sourceTestId: 'nested-card' });

		await dragOver({ page, target: page.getByTestId('outside-drop-target') });

		await expectDraggedOver({ page, testId: 'outside-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'nested',
			testId: 'outside-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });
	});

	test('a drag from outside every popover into the nested popover dismisses neither', async ({
		page,
	}) => {
		await visitFixture({ page });
		await openPopover({ page });
		await openNestedPopover({ page });

		await startDrag({ page, source: page.getByTestId('outside-card') });

		await expectDragging({ page, sourceTestId: 'outside-card' });

		await dragOver({ page, target: page.getByTestId('nested-drop-target') });

		await expectDraggedOver({ page, testId: 'nested-drop-target' });
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });

		await drop({ page });

		await expectDragFinished({ page });
		await expectDropRecorded({
			page,
			dragId: 'outside',
			testId: 'nested-drop-target',
			dropTargetTestIds: dropTargetTestIdsWithNested,
		});
		await expectPopoverOpen({ page, name: 'popover' });
		await expectPopoverOpen({ page, name: 'nested-popover' });
	});
});
