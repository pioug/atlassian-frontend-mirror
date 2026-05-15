import React, { type PropsWithChildren } from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { renderHook } from '@atlassian/testing-library';

import { SmartLinkEvents, useSmartLinkEvents } from '../../../index';
import { useFire3PWorkflowsClickEvent } from '../../SmartLinkEvents/useSmartLinkEvents';

describe('useSmartLinkEvents hook', () => {
	it('renders custom hook', () => {
		const result = renderHook(() => useSmartLinkEvents());
		expect(result.current).toBeInstanceOf(SmartLinkEvents);
	});
});

describe('useFire3PWorkflowsClickEvent', () => {
	const setup = () => {
		const onEvent = jest.fn();
		const wrapper = ({ children }: PropsWithChildren<{}>) => (
			<AnalyticsListener channel="media" onEvent={onEvent}>
				{children}
			</AnalyticsListener>
		);
		const result = renderHook(
			() => useFire3PWorkflowsClickEvent('confluence:page-1', 'ari:third-party:slack/abc'),
			{ wrapper },
		);
		return { fire: result.current, onEvent };
	};

	it('fires the event with isAuxClick=false and isContextMenu=false by default', () => {
		const { fire, onEvent } = setup();

		fire();

		expect(onEvent).toHaveBeenCalledTimes(1);
		const payload = onEvent.mock.calls[0][0].payload;
		expect(payload.attributes).toEqual(
			expect.objectContaining({
				eventName: 'smartLinkClickAnalyticsThirdPartyWorkflows',
				firstPartyIdentifier: 'confluence:page-1',
				isAuxClick: false,
				isContextMenu: false,
			}),
		);
	});

	it('fires the event with isAuxClick=true when called with { isAuxClick: true }', () => {
		const { fire, onEvent } = setup();

		fire({ isAuxClick: true });

		const payload = onEvent.mock.calls[0][0].payload;
		expect(payload.attributes).toEqual(
			expect.objectContaining({ isAuxClick: true, isContextMenu: false }),
		);
	});

	it('fires the event with isContextMenu=true when called with { isContextMenu: true }', () => {
		const { fire, onEvent } = setup();

		fire({ isContextMenu: true });

		const payload = onEvent.mock.calls[0][0].payload;
		expect(payload.attributes).toEqual(
			expect.objectContaining({ isAuxClick: false, isContextMenu: true }),
		);
	});
});
