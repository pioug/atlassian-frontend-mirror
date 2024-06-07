import { type PuppeteerPage, waitForTooltip } from '@atlaskit/visual-regression/helper';

export function hoverOverMentionByIdFactory(dataMentionId: string, expectTooltip: boolean) {
	return async (page: PuppeteerPage) => {
		await page.hover(`[data-mention-id="${dataMentionId}"] span`);
		if (expectTooltip) {
			await waitForTooltip(page);
		}
	};
}
