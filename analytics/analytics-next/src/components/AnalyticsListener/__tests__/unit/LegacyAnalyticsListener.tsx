import React, { memo, PureComponent, useCallback } from 'react';

import { fireEvent, render } from '@testing-library/react';
import PropTypes from 'prop-types';

import { type AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../../events/UIAnalyticsEvent';
import { useAnalyticsContext } from '../../../../hooks/useAnalyticsContext';
import { useRenderCounter } from '../../../../test-utils/useRenderCounter';
import LegacyAnalyticsListener from '../../LegacyAnalyticsListener';

type FakeConsumerButtonProps = { channel: string; event: UIAnalyticsEvent };

const FakeModernConsumerButton = memo<FakeConsumerButtonProps>(({ event, channel }) => {
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
});

// eslint-disable-next-line @repo/internal/react/no-class-components
class FakeLegacyConsumerButton extends PureComponent<FakeConsumerButtonProps> {
	context: any;
	renderCounter: number;

	static contextTypes = {
		getAtlaskitAnalyticsEventHandlers: PropTypes.func,
		getAtlaskitAnalyticsContext: PropTypes.func,
	};

	constructor(props: FakeConsumerButtonProps) {
		super(props);
		this.renderCounter = 0;
	}

	onClick = () => {
		const { getAtlaskitAnalyticsEventHandlers }: AnalyticsReactContextInterface = this.context;

		const { event, channel } = this.props;

		getAtlaskitAnalyticsEventHandlers().forEach((fn) => fn(event, channel));
	};

	render() {
		this.renderCounter++;
		return (
			<button data-render-count={this.renderCounter} onClick={this.onClick}>
				Button
			</button>
		);
	}
}

const UnderTestSingleListener = ({
	onEvent,
	listenChannel: listenChanel,
	event,
	sendChannel,
	FakeConsumerButton,
}: {
	event: UIAnalyticsEvent;
	FakeConsumerButton: React.JSXElementConstructor<FakeConsumerButtonProps>;
	listenChannel: string;
	onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
	sendChannel: string;
}) => {
	return (
		<LegacyAnalyticsListener onEvent={onEvent} channel={listenChanel}>
			<FakeConsumerButton event={event} channel={sendChannel} />
		</LegacyAnalyticsListener>
	);
};

const UnderTestTwoListeners = ({
	outerOnEvent,
	innerOnEvent,
	outerListenChannel,
	innerListenChannel,
	event,
	sendChannel,
	FakeConsumerButton,
}: {
	event: UIAnalyticsEvent;
	FakeConsumerButton: React.JSXElementConstructor<FakeConsumerButtonProps>;
	innerListenChannel: string;
	innerOnEvent: (event: UIAnalyticsEvent, channel?: string) => void;
	outerListenChannel: string;
	outerOnEvent: (event: UIAnalyticsEvent, channel?: string) => void;
	sendChannel: string;
}) => {
	return (
		<LegacyAnalyticsListener onEvent={outerOnEvent} channel={outerListenChannel}>
			<LegacyAnalyticsListener onEvent={innerOnEvent} channel={innerListenChannel}>
				<FakeConsumerButton event={event} channel={sendChannel} />
			</LegacyAnalyticsListener>
		</LegacyAnalyticsListener>
	);
};

describe('LegacyAnalyticsListener', () => {
	type TestBranch = {
		description: string;
		FakeConsumerButton: React.JSXElementConstructor<FakeConsumerButtonProps>;
	};

	const branches: TestBranch[] = [
		{
			FakeConsumerButton: FakeLegacyConsumerButton,
			description: 'with legacy context consuming component children',
		},
		{
			FakeConsumerButton: FakeModernConsumerButton,
			description: 'with modern context consuming component children',
		},
	];

	branches.forEach(({ FakeConsumerButton, description }) => {
		describe(description, () => {
			it('should listen for events on matching channels', () => {
				const onEvent = jest.fn();
				const event = new UIAnalyticsEvent({ payload: { action: 'click' } });

				const { getByText } = render(
					<UnderTestSingleListener
						onEvent={onEvent}
						listenChannel="atlaskit"
						event={event}
						sendChannel="atlaskit"
						FakeConsumerButton={FakeConsumerButton}
					/>,
				);

				fireEvent.click(getByText('Button'));

				expect(onEvent).toBeCalledWith(event, 'atlaskit');
				expect(getByText('Button').dataset.renderCount).toBe('1');
			});

			it('should not call onEvent when event is fired on a different channel', () => {
				const onEvent = jest.fn();
				const event = new UIAnalyticsEvent({ payload: { action: 'click' } });

				const { getByText } = render(
					<UnderTestSingleListener
						onEvent={onEvent}
						listenChannel="atlaskit"
						event={event}
						sendChannel="different-channel"
						FakeConsumerButton={FakeConsumerButton}
					/>,
				);

				fireEvent.click(getByText('Button'));

				expect(onEvent).not.toBeCalled();
				expect(getByText('Button').dataset.renderCount).toBe('1');
			});

			it('should listen on all channels when channel is "*"', () => {
				const onEvent = jest.fn();
				const event = new UIAnalyticsEvent({ payload: { action: 'click' } });

				const { getByText } = render(
					<UnderTestSingleListener
						onEvent={onEvent}
						listenChannel="*"
						event={event}
						sendChannel="any-channel"
						FakeConsumerButton={FakeConsumerButton}
					/>,
				);

				fireEvent.click(getByText('Button'));

				expect(onEvent).toBeCalledWith(event, 'any-channel');
				expect(getByText('Button').dataset.renderCount).toBe('1');
			});

			it('should propagate events to nested listeners', () => {
				const outerOnEvent = jest.fn();
				const innerOnEvent = jest.fn();
				const event = new UIAnalyticsEvent({ payload: { action: 'click' } });

				const { getByText } = render(
					<UnderTestTwoListeners
						outerOnEvent={outerOnEvent}
						innerOnEvent={innerOnEvent}
						outerListenChannel="atlaskit"
						innerListenChannel="atlaskit"
						event={event}
						sendChannel="atlaskit"
						FakeConsumerButton={FakeConsumerButton}
					/>,
				);

				fireEvent.click(getByText('Button'));

				expect(innerOnEvent).toBeCalledWith(event, 'atlaskit');
				expect(outerOnEvent).toBeCalledWith(event, 'atlaskit');
				expect(getByText('Button').dataset.renderCount).toBe('1');
			});

			it('should prevent rerenders when onEvent changes but always call the latest callback', () => {
				const onEvent1 = jest.fn();
				const onEvent2 = jest.fn();
				const event = new UIAnalyticsEvent({ payload: { action: 'click' } });

				const { rerender, getByText } = render(
					<UnderTestSingleListener
						onEvent={onEvent1}
						listenChannel="atlaskit"
						event={event}
						sendChannel="atlaskit"
						FakeConsumerButton={FakeConsumerButton}
					/>,
				);

				expect(getByText('Button').dataset.renderCount).toBe('1');

				fireEvent.click(getByText('Button'));

				expect(onEvent1).toBeCalledWith(event, 'atlaskit');

				rerender(
					<UnderTestSingleListener
						onEvent={onEvent2}
						listenChannel="atlaskit"
						event={event}
						sendChannel="atlaskit"
						FakeConsumerButton={FakeConsumerButton}
					/>,
				);

				expect(getByText('Button').dataset.renderCount).toBe('1');

				fireEvent.click(getByText('Button'));

				expect(onEvent2).toBeCalledWith(event, 'atlaskit');
			});
		});
	});
});
