import { expect, mobileBridgeEditorTestCase as test } from '../not-libra';

test('editor: calls analyticsBridge.trackEvent when analytics events are captured', async ({
	bridge,
}) => {
	await bridge.page.keyboard.type('* ');
	const trackEvents = await bridge.trackEvents();

	expect(trackEvents).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				actionSubject: 'editor',
				action: 'started',
				attributes: expect.objectContaining({
					appearance: 'mobile',
				}),
			}),
		]),
	);
});
