import { expect, test, viewports } from './fixtures';

test.describe('TTVC Dirty Scenarios', () => {
	test.use({
		examplePage: 'basic-section-below-viewport',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('ufo:vc:rev entry for `fy25.02` should have `clean: false` and `metric:vc90: null` when there is a mouse scroll event', async ({
				page,
				waitForReactUFOPayload,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				await page.mouse.wheel(0, 1000); // scroll 1000 pixels vertically

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

				expect(ttvcV2Revision).toBeTruthy();
				expect(ttvcV2Revision?.clean).toBeFalsy();
				expect(ttvcV2Revision?.['metric:vc90']).toBeNull();
			});

			test('ufo:vc:abort:reason is `scroll`, and there is no VC fields, when there is a window resize event', async ({
				page,
				waitForReactUFOPayload,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				await page.setViewportSize({ width: 600, height: 600 }); // change viewport size during runtime

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const vcAbortReason = reactUFOPayload!.attributes.properties['ufo:vc:abort:reason'];
				expect(vcAbortReason).toBe('resize');

				// NOTE: this should be changed, so that each VC revision entry contains an `abortReason` field
				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoVCRev).toBeUndefined();
			});

			test('ufo:vc:abort:reason is `keypress`, and there is no VC fields, when there is a keypress event', async ({
				page,
				waitForReactUFOPayload,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				await page.keyboard.press('Backspace'); // press backspace, generate keypress event

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const vcAbortReason = reactUFOPayload!.attributes.properties['ufo:vc:abort:reason'];
				expect(vcAbortReason).toBe('keypress');

				// NOTE: this should be changed, so that each VC revision entry contains an `abortReason` field
				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoVCRev).toBeUndefined();
			});
		});
	}
});
