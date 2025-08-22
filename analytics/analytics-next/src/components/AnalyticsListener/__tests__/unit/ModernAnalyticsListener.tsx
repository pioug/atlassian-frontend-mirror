import React, { memo, useCallback } from 'react';

import { fireEvent, render } from '@testing-library/react';

import AnalyticsReactContext from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../../events/UIAnalyticsEvent';
import { useAnalyticsContext } from '../../../../hooks/useAnalyticsContext';
import { useRenderCounter } from '../../../../test-utils/useRenderCounter';
import ModernAnalyticsListener from '../../ModernAnalyticsListener';

const FakeModernConsumerButton = memo(
	({ event, channel }: { channel: string; event: UIAnalyticsEvent }) => {
		const analyticsContext = useAnalyticsContext();
		const renderCounter = useRenderCounter();

		const onClick = useCallback(() => {
			const { getAtlaskitAnalyticsEventHandlers } = analyticsContext;
			getAtlaskitAnalyticsEventHandlers().forEach((fn) => fn(event, channel));
		}, [analyticsContext, event, channel]);

		return (
			<button data-render-count={renderCounter} onClick={onClick}>
				Button
			</button>
		);
	},
);

const UnderTestSingleListener = ({
	onEvent,
	listenChannel: listenChanel,
	event,
	sendChannel,
}: {
	event: UIAnalyticsEvent;
	listenChannel: string;
	onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
	sendChannel: string;
}) => {
	return (
		<ModernAnalyticsListener onEvent={onEvent} channel={listenChanel}>
			<FakeModernConsumerButton event={event} channel={sendChannel} />
		</ModernAnalyticsListener>
	);
};

const UnderTestTwoListeners = ({
	outerOnEvent,
	innerOnEvent,
	outerListenChannel,
	innerListenChannel,
	event,
	sendChannel,
}: {
	event: UIAnalyticsEvent;
	innerListenChannel: string;
	innerOnEvent: (event: UIAnalyticsEvent, channel?: string) => void;
	outerListenChannel: string;
	outerOnEvent: (event: UIAnalyticsEvent, channel?: string) => void;
	sendChannel: string;
}) => {
	return (
		<ModernAnalyticsListener onEvent={outerOnEvent} channel={outerListenChannel}>
			<ModernAnalyticsListener onEvent={innerOnEvent} channel={innerListenChannel}>
				<FakeModernConsumerButton event={event} channel={sendChannel} />
			</ModernAnalyticsListener>
		</ModernAnalyticsListener>
	);
};

describe('ModernAnalyticsListener', () => {
	it('should provide event handlers context to children', () => {
		const event = new UIAnalyticsEvent({ payload: { action: 'clicked' } });
		const onEvent = jest.fn();

		const { getByText } = render(
			<UnderTestSingleListener
				onEvent={onEvent}
				listenChannel="atlaskit"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(onEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(getByText('Button').dataset.renderCount).toBe('1');
	});

	it('should provide event handlers context to children including that from ancestors', () => {
		const event = new UIAnalyticsEvent({ payload: { action: 'clicked' } });
		const outerOnEvent = jest.fn();
		const innerOnEvent = jest.fn();

		const { getByText } = render(
			<UnderTestTwoListeners
				outerOnEvent={outerOnEvent}
				innerOnEvent={innerOnEvent}
				innerListenChannel="atlaskit"
				outerListenChannel="atlaskit"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(outerOnEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(innerOnEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(getByText('Button').dataset.renderCount).toBe('1');
	});

	it('should filter events based on channel', () => {
		const event = new UIAnalyticsEvent({ payload: { action: 'clicked' } });
		const outerOnEvent = jest.fn();
		const innerOnEvent = jest.fn();

		const { getByText, rerender } = render(
			<UnderTestTwoListeners
				outerOnEvent={outerOnEvent}
				innerOnEvent={innerOnEvent}
				outerListenChannel="atlaskit"
				innerListenChannel="media"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(outerOnEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(innerOnEvent).not.toHaveBeenCalled();
		expect(getByText('Button').dataset.renderCount).toBe('1');

		outerOnEvent.mockReset();
		innerOnEvent.mockReset();

		// Sanity check that listener nesting order doesn't matter
		rerender(
			<UnderTestTwoListeners
				outerOnEvent={outerOnEvent}
				innerOnEvent={innerOnEvent}
				outerListenChannel="media"
				innerListenChannel="atlaskit"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(outerOnEvent).not.toHaveBeenCalled();
		expect(innerOnEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(getByText('Button').dataset.renderCount).toBe('1');
	});

	it("should catch events on any channel when provided '*' as channel", () => {
		const event = new UIAnalyticsEvent({ payload: { action: 'clicked' } });
		const onEvent = jest.fn();

		const { getByText } = render(
			<UnderTestSingleListener
				onEvent={onEvent}
				listenChannel="*"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(onEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(getByText('Button').dataset.renderCount).toBe('1');
	});

	it('should not rerender children as channel or onEvent are changed', () => {
		const event = new UIAnalyticsEvent({ payload: { action: 'clicked' } });
		const firstOnEvent = jest.fn();

		const { getByText, rerender } = render(
			<UnderTestSingleListener
				onEvent={firstOnEvent}
				listenChannel="*"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(firstOnEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(getByText('Button').dataset.renderCount).toBe('1');

		firstOnEvent.mockReset();

		rerender(
			<UnderTestSingleListener
				onEvent={firstOnEvent}
				listenChannel="atlaskit"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(firstOnEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(getByText('Button').dataset.renderCount).toBe('1');

		const secondOnEvent = jest.fn();

		rerender(
			<UnderTestSingleListener
				onEvent={secondOnEvent}
				listenChannel="atlaskit"
				event={event}
				sendChannel="atlaskit"
			/>,
		);

		fireEvent.click(getByText('Button'));

		expect(secondOnEvent).toHaveBeenCalledWith(event, 'atlaskit');
		expect(getByText('Button').dataset.renderCount).toBe('1');
	});

	it('should recalculate getAnalyticsEventHandlers when getAtlaskitAnalyticsEventHandlers changes', () => {
		const event = new UIAnalyticsEvent({ payload: { action: 'clicked' } });
		const onEvent = jest.fn();
		const getAtlaskitAnalyticsEventHandlers = jest.fn(() => []);
		const newHandlerAction = jest.fn((event, channel) => ({ event, channel }));

		const { getByText, rerender } = render(
			<UnderTestSingleListener
				onEvent={onEvent}
				listenChannel="atlaskit"
				event={event}
				sendChannel="atlaskit"
			/>,
			{
				wrapper: ({ children }) => (
					<AnalyticsReactContext.Provider
						value={{
							getAtlaskitAnalyticsEventHandlers,
							getAtlaskitAnalyticsContext: jest.fn(),
						}}
					>
						{children}
					</AnalyticsReactContext.Provider>
				),
			},
		);

		fireEvent.click(getByText('Button'));
		expect(onEvent).toHaveBeenCalledTimes(1);

		const newGetAtlaskitAnalyticsEventHandlers = jest.fn(() => [
			(event: UIAnalyticsEvent, channel: string) => {
				newHandlerAction(event, channel);
			},
		]);

		rerender(
			<AnalyticsReactContext.Provider
				value={{
					getAtlaskitAnalyticsEventHandlers: newGetAtlaskitAnalyticsEventHandlers,
					getAtlaskitAnalyticsContext: jest.fn(),
				}}
			>
				<UnderTestSingleListener
					onEvent={onEvent}
					listenChannel="atlaskit"
					event={event}
					sendChannel="atlaskit"
				/>
			</AnalyticsReactContext.Provider>,
		);

		fireEvent.click(getByText('Button'));
		expect(onEvent).toHaveBeenCalledTimes(2);
	});
});
