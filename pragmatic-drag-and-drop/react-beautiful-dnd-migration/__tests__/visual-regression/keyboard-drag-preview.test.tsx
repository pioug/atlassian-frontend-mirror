import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import {
	getByTestId,
	screenshotPageWithoutCaptureBeyondViewport,
	setupExamplePage,
} from './_utils';

const cases = [
	['in standard lists', 'board'],
	['with react-window', 'react-window'],
	['with react-virtualized', 'react-virtualized'],
] as const;

describe('keyboard drag previews', () => {
	cases.forEach(([id, example]) => {
		const url = getExampleUrl(
			'pragmatic-drag-and-drop',
			'react-beautiful-dnd-migration',
			example,
			global.__BASEURL__,
			'light',
		);

		describe(id, () => {
			describe('vertical', () => {
				it('should display correctly in its initial position', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const cardA0 = await getByTestId(page, 'item-A0');
					await cardA0.focus();
					await page.keyboard.press('Space');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});

				it('should display correctly in an away position (moving in home list)', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const cardA0 = await getByTestId(page, 'item-A0');
					await cardA0.focus();
					await page.keyboard.press('Space');
					await page.keyboard.press('ArrowDown');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});

				it('should display correctly when returning home (moving in home list)', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const cardA0 = await getByTestId(page, 'item-A0');
					await cardA0.focus();
					await page.keyboard.press('Space');

					await page.keyboard.press('ArrowDown');
					await page.keyboard.press('ArrowUp');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});

				it('should display correctly in an away position (moving from an away list)', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const cardA0 = await getByTestId(page, 'item-A0');
					await cardA0.focus();
					await page.keyboard.press('Space');
					await page.keyboard.press('ArrowRight');
					await page.keyboard.press('ArrowRight');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});

				it('should display correctly when returning home (moving from an away list)', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const cardA0 = await getByTestId(page, 'item-A0');
					await cardA0.focus();
					await page.keyboard.press('Space');

					await page.keyboard.press('ArrowRight');
					await page.keyboard.press('ArrowRight');
					await page.keyboard.press('ArrowLeft');
					await page.keyboard.press('ArrowLeft');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});
			});

			describe('horizontal', () => {
				it('should display correctly in its initial position', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const columnA = await getByTestId(page, 'column-A--header');
					await columnA.focus();
					await page.keyboard.press('Space');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});

				it('should display correctly in an away position ', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const columnA = await getByTestId(page, 'column-A--header');
					await columnA.focus();
					await page.keyboard.press('Space');
					await page.keyboard.press('ArrowRight');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});

				it('should display correctly when returning home ', async () => {
					const { page } = global;
					await setupExamplePage(page, url);

					const columnA = await getByTestId(page, 'column-A--header');
					await columnA.focus();
					await page.keyboard.press('Space');

					await page.keyboard.press('ArrowRight');
					await page.keyboard.press('ArrowLeft');

					expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
				});
			});
		});
	});
});
