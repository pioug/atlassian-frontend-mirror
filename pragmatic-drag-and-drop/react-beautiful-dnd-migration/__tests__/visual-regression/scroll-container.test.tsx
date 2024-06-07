// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from 'puppeteer';

import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import {
	getByTestId,
	screenshotPageWithoutCaptureBeyondViewport,
	setupExamplePage,
} from './_utils';

describe('when draggable items are in scroll containers', () => {
	const url = getExampleUrl(
		'pragmatic-drag-and-drop',
		'react-beautiful-dnd-migration',
		'scroll-container',
		global.__BASEURL__,
		'light',
	);

	const scrollToBottomOfScrollContainer = async (page: Page) => {
		return page.$eval('#scroll-container', (element) => {
			// Scroll to the bottom
			element.scrollTop = element.scrollHeight;
		});
	};

	/**
	 * Context: there was a bug that caused the drop indicator to incorrectly
	 * render at the top of the scroll container, scrolling the container with it.
	 *
	 * This would occur when returning home because the drag preview was being
	 * measured to determine where to put the indicator.
	 *
	 * Now, when over home, the placeholder is used instead of the drag preview.
	 */
	describe('the preview when using keyboard controls', () => {
		it('should have the expected scroll behavior when returning home (moving from the target before)', async () => {
			const { page } = global;
			await setupExamplePage(page, url);

			await scrollToBottomOfScrollContainer(page);

			const card = await getByTestId(page, 'card-9');
			await card.focus();
			await page.keyboard.press('Space');

			// Move to the target before
			await page.keyboard.press('ArrowUp');
			// Move back to the home location
			await page.keyboard.press('ArrowDown');

			expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
		});

		it('should have the expected scroll behavior when returning home (moving from the target after)', async () => {
			const { page } = global;
			await setupExamplePage(page, url);

			await scrollToBottomOfScrollContainer(page);

			const card = await getByTestId(page, 'card-9');
			await card.focus();
			await page.keyboard.press('Space');

			// Move to the target after
			await page.keyboard.press('ArrowDown');
			// Move back to the home location
			await page.keyboard.press('ArrowUp');

			expect(await screenshotPageWithoutCaptureBeyondViewport(page)).toMatchProdImageSnapshot();
		});
	});
});
