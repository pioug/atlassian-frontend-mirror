import {
	getExampleUrl,
	pageSelector,
	type PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

export function getURL(testName: string, mode?: 'dark' | 'light' | 'none'): string {
	const exampleUrl = getExampleUrl(
		'linking-platform',
		'smart-card',
		testName,
		global.__BASEURL__,
		mode,
	);
	return exampleUrl + `&mediaMock=true`;
}

export async function setup(url: string) {
	const page: PuppeteerPage = global.page;
	await page.goto(url, {
		waitUntil: 'domcontentloaded',
	});
	await page.waitForSelector(pageSelector);
	await page.waitForNetworkIdle({ idleTime: 750 });
	return page;
}

export async function takeSnapshot(page: PuppeteerPage, height: number, y = 120) {
	const image = await page.screenshot({
		clip: { x: 0, y, width: 800, height },
	});
	return image;
}
