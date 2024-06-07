// eslint-disable-next-line import/no-extraneous-dependencies
import type { ElementHandle, Page, Point, Protocol } from 'puppeteer';
import invariant from 'tiny-invariant';

import { loadPage } from '@atlaskit/visual-regression/helper';

type DragData = Protocol.Input.DragData;

type HitRegion = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const gap = 4;

async function getHitRegionPoint(
	element: ElementHandle<Element>,
	region?: HitRegion,
): Promise<Point> {
	if (region === undefined) {
		return element.clickablePoint();
	}

	const boundingBox = await element.boundingBox();
	invariant(boundingBox);

	const { x, y, width, height } = boundingBox;

	const side = {
		left: x + gap,
		right: x + width - gap,
		top: y + gap,
		bottom: y + height - gap,
	};

	switch (region) {
		default:
		case 'top-left':
			return { x: side.left, y: side.top };

		case 'top-right':
			return { x: side.right, y: side.top };

		case 'bottom-left':
			return { x: side.left, y: side.bottom };

		case 'bottom-right':
			return { x: side.right, y: side.bottom };
	}
}

/**
 * DragInteraction simplifies creating drag interactions in tests.
 */
export class DragInteraction {
	private page: Page;
	private dragData?: DragData;
	private currentTarget?: Point;

	constructor(page: Page) {
		this.page = page;
	}

	async fromPoint(point: Point) {
		invariant(this.dragData === undefined, 'already dragging');
		this.dragData = await this.page.mouse.drag(point, {
			x: point.x + 100,
			y: point.y + 100,
		});
	}

	async fromElement(element: ElementHandle<Element>, region?: HitRegion) {
		const point = await getHitRegionPoint(element, region);
		await this.fromPoint(point);
	}

	async fromSelector(selector: string, region?: HitRegion) {
		const element = await this.page.$(selector);
		invariant(element);
		await this.fromElement(element, region);
	}

	async toPoint(point: Point) {
		invariant(this.dragData !== undefined, 'need to be dragging');
		this.currentTarget = point;

		await this.page.mouse.dragEnter(point, this.dragData);
		await this.page.mouse.dragOver(point, this.dragData);
	}

	async toElement(element: ElementHandle<Element>, region?: HitRegion) {
		const point = await getHitRegionPoint(element, region);
		await this.toPoint(point);
	}

	async toSelector(selector: string, region?: HitRegion) {
		const element = await this.page.$(selector);
		invariant(element);
		await this.toElement(element, region);
	}

	async drop() {
		invariant(this.dragData !== undefined, 'need to be dragging');
		invariant(this.currentTarget !== undefined, 'need a target');
		await this.page.mouse.drop(this.currentTarget, this.dragData);

		await this.page.mouse.up();
	}

	async cancel() {
		await this.page.keyboard.press('Escape');
		await this.page.mouse.up();
	}
}

/**
 * Usually, taking a screenshot in puppeteer fires a resize event,
 * which cancels the active keyboard drag.
 *
 * This helper passes the `{ captureBeyondViewport: false }` flag,
 * which seems to avoid this resizing behavior.
 */
export async function screenshotPageWithoutCaptureBeyondViewport(page: Page) {
	return page.screenshot({ captureBeyondViewport: false });
}

export async function getByTestId(page: Page, testId: string): Promise<ElementHandle<Element>> {
	const element = await page.$(`[data-testid="${testId}"]`);
	invariant(element !== null);
	return element;
}

/**
 * Loads the example page with the given URL,
 * and hides the radiogroup used to toggle between the migration layer and
 * `react-beautiful-dnd`.
 *
 * We hide the radiogroup because it was causing some flakiness in VR tests
 * that couldn't be reproduced in an actual browser.
 */
export async function setupExamplePage(page: Page, url: string) {
	await loadPage(page, url);

	/**
	 * Some tests were exhibiting weird behavior with the radiogroup present.
	 *
	 * They would display correctly when:
	 * - Running manually
	 * - Running only that test in isolation
	 *
	 * But when running all of the tests, they would display incorrectly.
	 *
	 * Hiding the radiogroup on the side seems to result in consistent behavior.
	 */
	return page.$eval('[role="radiogroup"]', (element) => {
		if (element instanceof HTMLElement) {
			element.style.display = 'none';
		}
	});
}
