/* eslint-disable testing-library/prefer-screen-queries */
import invariant from 'tiny-invariant';

import { expect, type Locator, type Page } from '@af/integration-testing';

/**
 * Drives real Pragmatic drag and drop drags, and asserts on the readouts that
 * `examples-utils/drag-and-drop-fixture.tsx` exposes.
 *
 * Pragmatic drag and drop is built on native HTML5 drag and drop, so a drag has
 * to be driven with the real pointer. Engines need several moves to start a
 * drag, and more than one move over a target to fire `dragover`, which is why
 * these constants exist and why the mechanics live in one place.
 */
const DRAG_START_DISTANCE = 48;
const DRAG_START_STEPS = 4;
const DRAG_OVER_STEPS = 8;
const SETTLE_MOVE_DISTANCE = 2;

export type TPoint = {
	x: number;
	y: number;
};

async function getCenter({ locator }: { locator: Locator }): Promise<TPoint> {
	const box = await locator.boundingBox();
	invariant(box, 'Expected the element to have a bounding box');

	return {
		x: box.x + box.width / 2,
		y: box.y + box.height / 2,
	};
}

/**
 * Starts a drag on `source` and leaves the pointer down. The pointer has to be
 * over `source` before the press, or no engine starts a drag.
 */
export async function startDrag({ page, source }: { page: Page; source: Locator }): Promise<void> {
	const center = await getCenter({ locator: source });

	await page.mouse.move(center.x, center.y);
	await page.mouse.down();
	await page.mouse.move(center.x + DRAG_START_DISTANCE, center.y, { steps: DRAG_START_STEPS });
}

/**
 * Moves the pressed pointer over `target` and leaves the pointer down. Returns
 * the point it finished on.
 */
export async function dragOver({ page, target }: { page: Page; target: Locator }): Promise<TPoint> {
	const center = await getCenter({ locator: target });

	await page.mouse.move(center.x, center.y, { steps: DRAG_OVER_STEPS });
	await page.mouse.move(center.x + SETTLE_MOVE_DISTANCE, center.y);
	await page.mouse.move(center.x, center.y);

	return center;
}

export async function drop({ page }: { page: Page }): Promise<void> {
	await page.mouse.up();
}

/**
 * Asserts a drag is in progress right now, and that it is `sourceTestId` being
 * dragged. Without this a test passes vacuously: if no drag ever started,
 * whatever it claims survived the drag was never at risk.
 */
export async function expectDragging({
	page,
	sourceTestId,
}: {
	page: Page;
	sourceTestId: string;
}): Promise<void> {
	await expect(page.getByTestId('drag-state')).toHaveText('dragging');
	await expect(page.getByTestId(sourceTestId)).toHaveAttribute('data-drag-state', 'dragging');
}

/**
 * Waits for the drag to finish, so that a dismiss arriving a task after the
 * pointer is released is not missed.
 */
export async function expectDragFinished({ page }: { page: Page }): Promise<void> {
	await expect(page.getByTestId('drag-state')).toHaveText('idle');
}

export async function expectDraggedOver({
	page,
	testId,
}: {
	page: Page;
	testId: string;
}): Promise<void> {
	await expect(page.getByTestId(testId)).toHaveAttribute('data-dragged-over', 'true');
}

/**
 * Asserts hit testing at `point` resolves to `testId`, which is what turns "the
 * pointer moved somewhere" into "the pointer is over that element".
 */
export async function expectPointerOver({
	page,
	point,
	testId,
}: {
	page: Page;
	point: TPoint;
	testId: string;
}): Promise<void> {
	const found = await page.evaluate(
		({ x, y }) =>
			document.elementFromPoint(x, y)?.closest('[data-testid]')?.getAttribute('data-testid') ??
			null,
		point,
	);

	expect(found).toBe(testId);
}

/**
 * Asserts `testId` recorded a drop of `dragId` and no other target recorded
 * anything. The second half rules out a drop landing somewhere the drag passed
 * over on the way.
 */
export async function expectDropRecorded({
	page,
	dragId,
	testId,
	dropTargetTestIds,
}: {
	page: Page;
	dragId: string;
	testId: string;
	dropTargetTestIds: readonly string[];
}): Promise<void> {
	await expect(page.getByTestId(`${testId}-last-drop`)).toHaveText(dragId);

	await Promise.all(
		dropTargetTestIds
			.filter((candidate) => candidate !== testId)
			.map((candidate) => expect(page.getByTestId(`${candidate}-last-drop`)).toHaveText('none')),
	);
}

export async function expectNoDropRecorded({
	page,
	dropTargetTestIds,
}: {
	page: Page;
	dropTargetTestIds: readonly string[];
}): Promise<void> {
	await Promise.all(
		dropTargetTestIds.map((candidate) =>
			expect(page.getByTestId(`${candidate}-last-drop`)).toHaveText('none'),
		),
	);
}
