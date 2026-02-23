/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('UFO Blindspot Watchdog', () => {
	test.use({
		examplePage: 'basic-with-blindspot', // 10 sections, but last 2 sections are missing a UFO Hold
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
				getSectionVisibleAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				const sectionNineVisibleAt = await getSectionVisibleAt('sectionNine');
				expect(sectionNineVisibleAt).toBeDefined();

				const sectionTenVisibleAt = await getSectionVisibleAt('sectionTen');
				expect(sectionTenVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const postInteractionLogPayload = await waitForPostInteractionLogPayload();
				expect(postInteractionLogPayload).toBeDefined();

				const { interactionMetrics } = reactUFOPayload!.attributes.properties;
				expect(interactionMetrics).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const ttvcV3Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.03');

				const { postInteractionLog } = postInteractionLogPayload!.attributes.properties;
				expect(postInteractionLog.lastInteractionFinish.vc90).toBe(ttvcV3Revision?.['metric:vc90']);
				expect(postInteractionLog.lastInteractionFinish.ttai).toBe(interactionMetrics.end);
				expect(postInteractionLog.lastInteractionFinish.vcClean).toBe(ttvcV3Revision?.clean);
				expect(postInteractionLog.lastInteractionFinish.routeName).toBe(
					interactionMetrics.routeName,
				);
				expect(postInteractionLog.lastInteractionFinish.errors).toStrictEqual(
					interactionMetrics.errors,
				);

				expect(postInteractionLog.vcClean).toBe(true);
				expect(postInteractionLog.revisedTtai).toMatchTimestamp(sectionTenVisibleAt);
				expect(postInteractionLog.revisedVC90).toMatchTimestamp(sectionNineVisibleAt);

				expect(postInteractionLog.lateMutations.length >= 2).toBe(true);

				const sectionNineLateMutationRecord = postInteractionLog.lateMutations.find(({ element }) =>
					element.includes('sectionNine'),
				);
				const sectionTenLateMutationRecord = postInteractionLog.lateMutations.find(({ element }) =>
					element.includes('sectionTen'),
				);

				expect(sectionNineLateMutationRecord?.element).toBe('div[data-testid="sectionNine"]');
				expect(sectionNineLateMutationRecord?.time).toMatchTimestamp(sectionNineVisibleAt);
				expect(sectionNineLateMutationRecord?.labelStack).toBe(
					'app-root/slow-components/section-nine',
				);
				expect(sectionNineLateMutationRecord?.segment).toBe('app-root');

				expect(sectionTenLateMutationRecord?.element).toBe('div[data-testid="sectionTen"]');
				expect(sectionTenLateMutationRecord?.time).toMatchTimestamp(sectionTenVisibleAt);
				expect(sectionTenLateMutationRecord?.labelStack).toBe(
					'app-root/slow-components/blindspot-segment',
				);
				expect(sectionTenLateMutationRecord?.segment).toBe(
					'app-root/slow-components/blindspot-segment',
				);

				expect(postInteractionLog.reactProfilerTimings.length).toBe(2);
				expect(postInteractionLog.reactProfilerTimings[1].endTime).toMatchTimestamp(
					sectionTenVisibleAt,
				);
			});

			test('should capture and report a11y violations', async ({ page }) => {
				const mainDiv = page.locator('[data-testid="main"]');
				expect(mainDiv).toBeDefined();

				await expect(page).toBeAccessible();
			});
		});
	}
});
