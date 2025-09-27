/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: post-interaction-log late holds', () => {
	test.use({
		examplePage: 'basic-with-late-hold',
		featureFlags: ['platform_ufo_enable_late_holds_post_interaction'],
	});

	test('adds postInteractionHoldInfo when FG is enabled', async ({
		page,
		waitForPostInteractionLogPayload,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		const postInteractionLogPayload = await waitForPostInteractionLogPayload();
		expect(postInteractionLogPayload).toBeDefined();

		const { postInteractionLog } = postInteractionLogPayload!.attributes.properties;
		expect(postInteractionLog).toBeDefined();

		const holds = postInteractionLog.postInteractionHoldInfo;
		expect(holds).toMatchObject([
			{
				name: 'section-three',
				labelStack: 'app-root',
				start: expect.any(Number),
			},
		]);
	});
});
