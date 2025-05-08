/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: fy25.02 - style mutation', () => {
	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				examplePage: 'fy25_02-style-mutation',
				viewport,
			});

			test(`VC90 should match when the [content-div] is first visible`, async ({
				page,
				waitForReactUFOPayload,
				getSectionAttributeNthChange,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const contentDiv = page.locator('[data-testid="content-div"]');

				await expect(mainDiv).toBeVisible();
				await expect(contentDiv).toBeVisible();

				// const mainDivAddedAt = await getSectionDOMAddedAt('main');
				const contentDivMutatedAt = await getSectionAttributeNthChange('content-div', 0);

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				const fy25_02_rev = ufoRevisions?.find((r) => r.revision === 'fy25.02');
				expect(fy25_02_rev).toBeDefined();

				const vcDetails = fy25_02_rev?.vcDetails;
				expect(vcDetails).toBeDefined();

				expect(fy25_02_rev?.clean).toBe(true);

				// TODO the following assertions are causing flakiness
				// expect(vcDetails?.['25'].t).toMatchTimestamp(mainDivAddedAt);
				expect(vcDetails?.['25'].e).toEqual(['div[testid=main]']);

				expect(vcDetails?.['50'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['50'].e).toEqual(['div[testid=content-div]']);

				expect(vcDetails?.['75'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['75'].e).toEqual(['div[testid=content-div]']);

				expect(vcDetails?.['80'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['80'].e).toEqual(['div[testid=content-div]']);

				expect(vcDetails?.['85'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['85'].e).toEqual(['div[testid=content-div]']);

				expect(vcDetails?.['90'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['90'].e).toEqual(['div[testid=content-div]']);

				expect(vcDetails?.['95'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['95'].e).toEqual(['div[testid=content-div]']);

				expect(vcDetails?.['98'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['98'].e).toEqual(['div[testid=content-div]']);

				expect(vcDetails?.['99'].t).toMatchTimestamp(contentDivMutatedAt);
				expect(vcDetails?.['99'].e).toEqual(['div[testid=content-div]']);

				const vc90Result = fy25_02_rev!['metric:vc90'];
				expect(vc90Result).toBeDefined();
				expect(vc90Result).toMatchTimestamp(contentDivMutatedAt);

				expect(vcDetails?.['90'].t).toEqual(vc90Result);
			});
		});
	}
});
