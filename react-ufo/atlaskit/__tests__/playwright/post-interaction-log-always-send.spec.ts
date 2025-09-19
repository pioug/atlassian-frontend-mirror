/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: post-interaction-log always send', () => {
	test.use({
		examplePage: 'basic-three-sections',
		featureFlags: ['platform_ufo_always_send_post_interaction_log'],
	});

	test('sends post interaction log when FG is enabled', async ({
		page,
		waitForPostInteractionLogPayload,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		const postInteractionLogPayload = await waitForPostInteractionLogPayload();
		expect(postInteractionLogPayload).toBeDefined();

		const { postInteractionLog } = postInteractionLogPayload!.attributes.properties;
		expect(postInteractionLog).toBeDefined();
		expect(postInteractionLog.lastInteractionFinish).toBeDefined();
	});
});
