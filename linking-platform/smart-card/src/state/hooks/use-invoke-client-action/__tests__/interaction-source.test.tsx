import { renderHook } from '@testing-library/react';

import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import useInvokeClientAction from '../index';

it.each(['spotlightCta', 'inlineAction'] as const)(
	'labels the Rovo invocation from %s',
	async (interactionSource) => {
		passGate('platform_sl_one_click_chat_spotlight_v2_fg');
		const fireEvent = jest.fn();
		const actionFn = jest.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useInvokeClientAction({ fireEvent }));
		await result.current({
			actionFn,
			actionType: 'RovoChatAction',
			actionSubjectId: 'rovoChatPrompt',
			interactionSource,
		});
		expect(fireEvent).toHaveBeenCalledWith(
			'ui.button.clicked.rovoChatPrompt',
			expect.objectContaining({ interactionSource }),
		);
		expect(actionFn).toHaveBeenCalledTimes(1);
	},
);
it.each([true, false])('keeps unlabelled callers unchanged with gate %s', async (enabled) => {
	(enabled ? passGate : failGate)('platform_sl_one_click_chat_spotlight_v2_fg');
	const fireEvent = jest.fn();
	const { result } = renderHook(() => useInvokeClientAction({ fireEvent }));
	await result.current({
		actionFn: async () => {},
		actionType: 'RovoChatAction',
		actionSubjectId: 'rovoChatPrompt',
		...(enabled ? {} : { interactionSource: 'spotlightCta' as const }),
	});
	expect(fireEvent.mock.calls[0][1]).not.toHaveProperty('interactionSource');
});
it('does not label other client actions', async () => {
	passGate('platform_sl_one_click_chat_spotlight_v2_fg');
	const fireEvent = jest.fn();
	const { result } = renderHook(() => useInvokeClientAction({ fireEvent }));
	await result.current({
		actionFn: async () => {},
		actionType: 'PreviewAction',
		actionSubjectId: 'invokePreviewScreen',
		interactionSource: 'spotlightCta',
	});
	expect(fireEvent.mock.calls[0][1]).not.toHaveProperty('interactionSource');
});
