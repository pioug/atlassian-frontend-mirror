import { expect, type Page, test } from '@af/integration-testing';

const visitExample = ({ page, exampleName }: { page: Page; exampleName: string }) =>
	page.visitExample('ai-mate', 'rovo-triggers', exampleName);

test('publish a pubsub event from iframe to parent, and acknowledged', async ({ page }) => {
	await visitExample({ page, exampleName: 'iframe-to-pubsub-parent-content' });
	const onAcknowledgeTimeoutSelector = '[data-testid="onAcknowledgeTimeout-happened"]';

	// test publishing an event from the first iframe
	const iframeOneSelector = 'iframe[data-testid="test-embed-frame-1"]';
	const publishChatNewSelector = 'button[data-testid="publish-chat-new-to-parent-window"]';

	await page.frameLocator(iframeOneSelector).locator(publishChatNewSelector).click();

	const expectedFirstEventText =
		'{"type":"chat-new","source":"FrameId: embed-one","data":{"prompt":"Hello from children. FrameId: embed-one","dialogues":[],"name":"Frame embed-one convo title"}}';
	await expect(page.locator('[data-testid="event-log"] li:first-child')).toHaveText(
		expectedFirstEventText,
	);

	// test that onAcknowledgeTimeout is not called, wait for TIMEOUT_WAIT_FOR_ACK + buffer
	await expect(
		page.frameLocator(iframeOneSelector).locator(onAcknowledgeTimeoutSelector),
	).not.toBeVisible({ timeout: 100 + 50 });

	// test publishing another event from the second iframe
	const iframeTwoSelector = 'iframe[data-testid="test-embed-frame-2"]';
	await page.frameLocator(iframeTwoSelector).locator(publishChatNewSelector).click();

	const expectedSecondEventText =
		'{"type":"chat-new","source":"FrameId: embed-two","data":{"prompt":"Hello from children. FrameId: embed-two","dialogues":[],"name":"Frame embed-two convo title"}}';
	await expect(page.locator('[data-testid="event-log"] li:nth-child(2)')).toHaveText(
		expectedSecondEventText,
	);

	// Ensure only two li elements are present
	await expect(page.locator('[data-testid="event-log"] li')).toHaveCount(2);

	await expect(
		page.frameLocator(iframeTwoSelector).locator(onAcknowledgeTimeoutSelector),
	).not.toBeVisible({ timeout: 100 + 50 });
});

test('publish a pubsub event that ack times out and calls onAcknowledgeTimeout', async ({
	page,
}) => {
	await visitExample({ page, exampleName: 'iframe-to-pubsub-iframed-content' });

	const popupPromise = page.waitForEvent('popup');
	const publishChatNewSelector = 'button[data-testid="publish-chat-new-to-parent-window"]';
	await page.locator(publishChatNewSelector).click();

	const popup = await popupPromise;
	expect(popup.url()).toContain(`https://www.atlassian.com`);
});

test('should capture and report a11y violations', async ({ page }) => {
	await visitExample({ page, exampleName: 'iframe-to-pubsub-parent-content' });
	// test publishing an event from the first iframe
	const iframeOneSelector = 'iframe[data-testid="test-embed-frame-1"]';
	const publishChatNewSelector = 'button[data-testid="publish-chat-new-to-parent-window"]';
	await page.frameLocator(iframeOneSelector).locator(publishChatNewSelector).click();

	await expect(page).toBeAccessible({ violationCount: 1 });
});
