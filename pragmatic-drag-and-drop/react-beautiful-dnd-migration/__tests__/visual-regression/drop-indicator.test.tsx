// eslint-disable-next-line import/no-extraneous-dependencies
import type { ElementHandle, Page } from 'puppeteer';
import invariant from 'tiny-invariant';

import { getExampleUrl, loadPage, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

import { DragInteraction } from './_utils';

async function getByTestId(page: Page, testId: string): Promise<ElementHandle<Element>> {
	const element = await page.$(`[data-testid="${testId}"]`);
	invariant(element !== null);
	return element;
}

function getColumnSelector(columnId: string) {
	return `[data-rbd-draggable-id="draggable-${columnId}"]`;
}

async function hideByTestId(page: Page, testId: string) {
	return page.$eval(`[data-testid="${testId}"]`, (el) => {
		if (el instanceof HTMLElement) {
			el.style.opacity = '0';
		}
	});
}

describe('drop indicators', () => {
	describe.each([
		['in standard lists', 'board'],
		['with react-window', 'react-window'],
		['with react-virtualized', 'react-virtualized'],
	])('%s', (_, example) => {
		const url = getExampleUrl(
			'pragmatic-drag-and-drop',
			'react-beautiful-dnd-migration',
			example,
			global.__BASEURL__,
			'light',
		);

		it('should display correctly for draggable targets', async () => {
			const { page } = global;
			await loadPage(page, url);

			await page.setDragInterception(true);

			const cardA0 = await getByTestId(page, 'item-A0');
			const cardB0 = await getByTestId(page, 'item-B0');

			const drag = new DragInteraction(page);

			await drag.fromElement(cardA0);
			await drag.toElement(cardB0, 'top-left');

			/**
			 * The drag preview was causing flakiness, so this hides it.
			 */
			await hideByTestId(page, 'item-A0');

			expect(await takeElementScreenShot(page, getColumnSelector('B'))).toMatchProdImageSnapshot();

			await drag.toElement(cardB0, 'bottom-left');

			expect(await takeElementScreenShot(page, getColumnSelector('B'))).toMatchProdImageSnapshot();

			await drag.drop();
		});

		// FIXME: This test was automatically skipped due to failure on 01/07/2023: https://product-fabric.atlassian.net/browse/DSP-11492
		it.skip('should display at the end of droppable targets with items', async () => {
			const { page } = global;
			await loadPage(page, url);

			await page.setDragInterception(true);

			const cardA0 = await getByTestId(page, 'item-A0');
			const columnC = await page.$(getColumnSelector('C'));
			invariant(columnC);

			const drag = new DragInteraction(page);

			// Drags over the empty space at the end of the droppable
			await drag.fromElement(cardA0);
			await drag.toPoint(await columnC.clickablePoint({ x: 40, y: 440 }));

			/**
			 * The drag preview was causing flakiness, so this hides it.
			 */
			await hideByTestId(page, 'item-A0');

			expect(await columnC.screenshot()).toMatchProdImageSnapshot();

			await drag.drop();
		});

		// FIXME: This test was automatically skipped due to failure on 01/07/2023: https://product-fabric.atlassian.net/browse/DSP-11493
		it.skip('should display at the top of empty droppable targets', async () => {
			const { page } = global;
			await loadPage(page, url);

			await page.setDragInterception(true);

			const columnC = await page.$(getColumnSelector('C'));
			invariant(columnC);

			/**
			 * Clear the column by moving all the cards to another column.
			 */
			let firstCard = await columnC.$('[data-rbd-draggable-id]');
			while (firstCard) {
				await firstCard.dragAndDrop(await getByTestId(page, 'item-A0'));
				firstCard = await columnC.$('[data-rbd-draggable-id]');
			}

			const drag = new DragInteraction(page);
			// Drags over the empty space at the end of the droppable
			await drag.fromElement(await getByTestId(page, 'item-A0'));
			await drag.toPoint(await columnC.clickablePoint({ x: 40, y: 440 }));

			/**
			 * The drag preview was causing flakiness, so this hides it.
			 */
			await hideByTestId(page, 'item-A0');

			expect(await columnC.screenshot()).toMatchProdImageSnapshot();

			await drag.drop();
		});
	});
});
