import React, { memo, PureComponent, useCallback } from 'react';

import { fireEvent, render } from '@testing-library/react';
import PropTypes from 'prop-types';

import { AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../../events/UIAnalyticsEvent';
import { useAnalyticsContext } from '../../../../hooks/useAnalyticsContext';
import { useRenderCounter } from '../../../../test-utils/useRenderCounter';
import LegacyAnalyticsListener from '../../LegacyAnalyticsListener';

type FakeConsumerButtonProps = { event: UIAnalyticsEvent; channel: string };

const FakeModernConsumerButton = memo<FakeConsumerButtonProps>(
  ({ event, channel }) => {
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

// eslint-disable-next-line @repo/internal/react/no-class-components
class FakeLegacyConsumerButton extends PureComponent<FakeConsumerButtonProps> {
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
    const {
      getAtlaskitAnalyticsEventHandlers,
    }: AnalyticsReactContextInterface = this.context;

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
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
  listenChannel: string;
  sendChannel: string;
  event: UIAnalyticsEvent;
  FakeConsumerButton: React.JSXElementConstructor<FakeConsumerButtonProps>;
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
  outerOnEvent: (event: UIAnalyticsEvent, channel?: string) => void;
  innerOnEvent: (event: UIAnalyticsEvent, channel?: string) => void;
  event: UIAnalyticsEvent;
  outerListenChannel: string;
  innerListenChannel: string;
  sendChannel: string;
  FakeConsumerButton: React.JSXElementConstructor<FakeConsumerButtonProps>;
}) => {
  return (
    <LegacyAnalyticsListener
      onEvent={outerOnEvent}
      channel={outerListenChannel}
    >
      <LegacyAnalyticsListener
        onEvent={innerOnEvent}
        channel={innerListenChannel}
      >
        <FakeConsumerButton event={event} channel={sendChannel} />
      </LegacyAnalyticsListener>
    </LegacyAnalyticsListener>
  );
};

describe('LegacyAnalyticsListener', () => {
  type TestBranch = {
    FakeConsumerButton: React.JSXElementConstructor<FakeConsumerButtonProps>;
    description: string;
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
      it('should provide event handlers context to children', () => {
        const event = new UIAnalyticsEvent({ payload: { action: 'clicked' } });
        const onEvent = jest.fn();

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
            FakeConsumerButton={FakeConsumerButton}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(outerOnEvent).toBeCalledWith(event, 'atlaskit');
        expect(innerOnEvent).toBeCalledWith(event, 'atlaskit');
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
            FakeConsumerButton={FakeConsumerButton}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(outerOnEvent).toBeCalledWith(event, 'atlaskit');
        expect(innerOnEvent).not.toBeCalled();
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
            FakeConsumerButton={FakeConsumerButton}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(outerOnEvent).not.toBeCalled();
        expect(innerOnEvent).toBeCalledWith(event, 'atlaskit');
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
            FakeConsumerButton={FakeConsumerButton}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(onEvent).toBeCalledWith(event, 'atlaskit');
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
            FakeConsumerButton={FakeConsumerButton}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(firstOnEvent).toBeCalledWith(event, 'atlaskit');
        expect(getByText('Button').dataset.renderCount).toBe('1');

        firstOnEvent.mockReset();

        rerender(
          <UnderTestSingleListener
            onEvent={firstOnEvent}
            listenChannel="atlaskit"
            event={event}
            sendChannel="atlaskit"
            FakeConsumerButton={FakeConsumerButton}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(firstOnEvent).toBeCalledWith(event, 'atlaskit');
        expect(getByText('Button').dataset.renderCount).toBe('1');

        const secondOnEvent = jest.fn();

        rerender(
          <UnderTestSingleListener
            onEvent={secondOnEvent}
            listenChannel="atlaskit"
            event={event}
            sendChannel="atlaskit"
            FakeConsumerButton={FakeConsumerButton}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(secondOnEvent).toBeCalledWith(event, 'atlaskit');
        expect(getByText('Button').dataset.renderCount).toBe('1');
      });
    });
  });
});
