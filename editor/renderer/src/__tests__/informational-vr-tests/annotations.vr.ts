// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';
import { RendererWithAnnotations } from '../__helpers/rendererWithAnnotations';
import { selectors } from '../__helpers/page-objects/_annotation';

snapshotInformational(RendererWithAnnotations, {
	description: 'displays draft highlight on select text and click to comment',
	prepare: async (page) => {
		await page.waitForSelector(selectors.annotation);
		await selectTextToAnnotate(page.getByText('another text without annotation'));
		const commentButton = await page.waitForSelector(selectors.commentButton);
		await commentButton?.click();
		await page.waitForSelector(selectors.draftAnnotation);

		// click away to remove browser selection from highlighted text
		page.mouse.click(1, 1, {
			//short delay in between mouse down and up
			delay: 10,
		});
	},
});

//evaluating on browser to get reliable selection
async function selectTextToAnnotate(locator: Locator) {
	return await locator.evaluate((element: HTMLElement) => {
		const selection = window.getSelection();
		const range = document.createRange();
		range.setStart(element.childNodes[0], 0);
		range.setEnd(element.childNodes[0], element?.innerText?.length);
		selection?.removeAllRanges();
		selection?.addRange(range);
	});
}
