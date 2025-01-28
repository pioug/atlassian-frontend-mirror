/* eslint-disable compat/compat */
import { test as base, type Page } from '@af/integration-testing';

const prepareParams = (params?: { [key: string]: string | boolean }) => {
	if (!params) {
		return { urlParams: {}, featureFlags: '' };
	}

	const { featureFlag, ...rest } = params;

	// url param in string format: '&featureFlag=feature-flag-key&featureFlag=feature-flag-key'
	const featureFlags =
		typeof params.featureFlag === 'string'
			? // Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				`&featureFlag=${params.featureFlag.split(/[ ,;]+/).join('&featureFlag=')}`
			: '';

	return { urlParams: rest, featureFlags };
};

const getExampleURL = (props: {
	baseURL: string | undefined;
	groupId: string;
	packageId: string;
	exampleId: string | undefined;
	params: Record<string, string | boolean> | undefined;
}) => {
	const { baseURL, groupId, packageId, exampleId, params } = props;
	const { urlParams, featureFlags } = prepareParams(params);
	const searchParams = new URLSearchParams({
		groupId,
		packageId,
		isTestRunner: 'true',
		...(exampleId ? { exampleId } : {}),
		mode: 'light',
		...urlParams,
	});

	const url = `${baseURL}/examples.html?${searchParams.toString()}${featureFlags}`;
	return url;
};

export const test = base.extend<{
	viewport: {
		width: number;
		height: number;
	};
	examplePage: string;
	ufoVC90: () => Promise<number>;
}>({
	viewport: {
		width: 900,
		height: 600,
	},
	examplePage: 'basic',
	ufoVC90: async ({ page }, use) => {
		const result = () => {
			return page.evaluate(() => {
				// TODO: update to use actual VC90 value
				return Promise.resolve(9000);
			});
		};

		await use(result);
	},

	page: async ({ browser, baseURL, viewport, examplePage }, use, testInfo) => {
		// For those tests work properly, it is really important the page isn't cached
		const context = await browser.newContext();
		const page = await context.newPage();

		page.on('console', async (msg) => {
			const t = msg.text();

			if (t.startsWith('REACT-UFO')) {
				// eslint-disable-next-line no-console
				console.log(t);
			}
		});

		// @ts-ignore
		(page as unknown as Page).visitExample = (
			groupId: string,
			packageId: string,
			exampleId?: string,
			params?: Record<string, string | boolean>,
		) => {
			const url = getExampleURL({
				groupId,
				packageId,
				exampleId,
				params,
				baseURL,
			});

			return page.goto(url, {
				waitUntil: 'domcontentloaded',
			});
		};

		await page.setViewportSize({
			width: viewport.width,
			height: viewport.height,
		});

		// @ts-ignore
		((await page) as unknown as Page).visitExample('react-ufo', 'atlaskit', examplePage);

		await use(page);
	},
});
