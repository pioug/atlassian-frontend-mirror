import { expect, test } from './fixtures';

test.describe('ReactUFO: transition VC', () => {
	test.use({
		examplePage: 'app-with-top-left-nav',
	});

	test('interactionMetrics transition VC', async ({
		page,
		waitForReactUFOPayload,
		getSectionVisibleAt,
		getSectionDOMAddedAt,
	}) => {
		const ufoPageLoadPayload = await waitForReactUFOPayload();
		expect(ufoPageLoadPayload).toBeDefined();

		// Click on the projects menu item to trigger a transition
		await page.click('text=projects');

		// Wait for the transition payload
		const transitionPayload = await waitForReactUFOPayload();
		expect(transitionPayload).toBeDefined();

		const ufoProperties = transitionPayload!.attributes.properties;
		expect(ufoProperties['experience:name']).toBe('projects');

		const { interactionMetrics } = ufoProperties;
		expect(interactionMetrics.type).toBe('transition');

		const ufoVCRev = ufoProperties['ufo:vc:rev'];
		const rawHandlerRevision = ufoVCRev?.find(({ revision }) => revision === 'raw-handler');
		expect(rawHandlerRevision).toBeTruthy();
		expect(rawHandlerRevision!.rawData).toBeDefined();
		expect(rawHandlerRevision!.rawData!.obs!.length).toBeGreaterThan(0);
		expect(rawHandlerRevision!.rawData!.eid).toBeDefined();

		const rawElementNames = Object.values(rawHandlerRevision!.rawData!.eid!) as string[];
		expect(rawElementNames.some((name) => name.includes('main-content-projects'))).toBe(true);

		const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');
		expect(ttvcV2Revision).toBeTruthy();

		const projectsDOMAddedAt =
			(await getSectionDOMAddedAt('main-content-projects'))! - interactionMetrics.start;

		expect(ttvcV2Revision!['metric:vc90']).toMatchTimestamp(projectsDOMAddedAt);

		const ttvcV3Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.03');
		expect(ttvcV3Revision).toBeTruthy();
		const projectsVisibleAt =
			(await getSectionVisibleAt('main-content-projects'))! - interactionMetrics.start;
		expect(ttvcV3Revision!['metric:vc90']).toMatchTimestamp(projectsVisibleAt);
	});

	test('should capture and report a11y violations', async ({
		page,
		waitForReactUFOPayload,
		getSectionVisibleAt,
		getSectionDOMAddedAt,
	}) => {
		const ufoPageLoadPayload = await waitForReactUFOPayload();
		expect(ufoPageLoadPayload).toBeDefined();

		await expect(page).toBeAccessible();
	});
});
