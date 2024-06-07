// eslint-disable-next-line import/no-extraneous-dependencies
import type { ElementHandle, Page } from 'puppeteer';
import invariant from 'tiny-invariant';

import { getExampleUrl, loadPage, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

async function getByTestId(page: Page, testId: string): Promise<ElementHandle<Element>> {
	const element = await page.$(`[data-testid="${testId}"]`);
	invariant(element !== null);
	return element;
}

describe('smoke tests for board example', () => {
	const url = getExampleUrl(
		'pragmatic-drag-and-drop',
		'react-beautiful-dnd-migration',
		'board',
		global.__BASEURL__,
		'light',
	);

	const boardSelector = '[data-testid="board"]';

	it('should support dragging cards', async () => {
		const { page } = global;
		await loadPage(page, url);

		await page.setDragInterception(true);

		const cardA0 = await getByTestId(page, 'item-A0');
		const cardB0 = await getByTestId(page, 'item-B0');

		await cardA0.dragAndDrop(cardB0);

		const snapshot = await takeElementScreenShot(page, boardSelector);
		expect(snapshot).toMatchProdImageSnapshot();
	});

	it('should support dragging columns', async () => {
		const { page } = global;
		await loadPage(page, url);

		await page.setDragInterception(true);

		const columnA = await getByTestId(page, 'column-A--header');
		const columnC = await getByTestId(page, 'column-C--header');

		await columnA.dragAndDrop(columnC);

		const snapshot = await takeElementScreenShot(page, boardSelector);
		expect(snapshot).toMatchProdImageSnapshot();
	});
});
