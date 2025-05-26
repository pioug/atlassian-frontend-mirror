/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('UFO Blindspot Watchdog', () => {
	test.use({
		examplePage: 'basic-with-blindspot', // 10 sections, but last section is missing a UFO Hold
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`post-interaction-log should be consistent with the original UFO payload`, async ({
				page,
				waitForReactUFOPayload,
				waitForPostInteractionLogPayload,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				const sectionEightVisibleAt = await getSectionDOMAddedAt('sectionEight');
				expect(sectionEightVisibleAt).toBeDefined();

				const sectionNineVisibleAt = await getSectionDOMAddedAt('sectionNine');
				expect(sectionNineVisibleAt).toBeDefined();

				const sectionTenVisibleAt = await getSectionDOMAddedAt('sectionTen');
				expect(sectionTenVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const postInteractionLogPayload = await waitForPostInteractionLogPayload();
				expect(postInteractionLogPayload).toBeDefined();

				const { interactionMetrics } = reactUFOPayload!.attributes.properties;
				expect(interactionMetrics).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

				const { postInteractionLog } = postInteractionLogPayload!.attributes.properties;
				expect(postInteractionLog.lastInteractionFinish.vc90).toBe(ttvcV2Revision?.['metric:vc90']);
				expect(postInteractionLog.lastInteractionFinish.ttai).toBe(interactionMetrics.end);
				expect(postInteractionLog.lastInteractionFinish.vcClean).toBe(ttvcV2Revision?.clean);
				expect(postInteractionLog.lastInteractionFinish.routeName).toBe(
					interactionMetrics.routeName,
				);
				expect(postInteractionLog.lastInteractionFinish.errors).toStrictEqual(
					interactionMetrics.errors,
				);

				expect(postInteractionLog.vcClean).toBe(true);
				expect(postInteractionLog.revisedTtai).toMatchTimestamp(sectionTenVisibleAt);
				expect(postInteractionLog.revisedVC90).toMatchTimestamp(sectionNineVisibleAt);

				expect(postInteractionLog.lateMutations.length).toBe(1);
				expect(postInteractionLog.lateMutations[0]?.element).toBe('div[testid=sectionTen]');
				expect(postInteractionLog.lateMutations[0]?.time).toMatchTimestamp(sectionTenVisibleAt);

				expect(postInteractionLog.reactProfilerTimings.length).toBe(1);
				expect(postInteractionLog.reactProfilerTimings[0].endTime).toMatchTimestamp(
					sectionTenVisibleAt,
				);
			});
		});
	}
});
