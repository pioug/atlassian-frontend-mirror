import React, {
  createRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { fireEvent, render } from '@testing-library/react';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../events/UIAnalyticsEvent';
import { useTrackedRef } from '../../../hooks/useTrackedRef';
import { useRenderCounter } from '../../../test-utils/useRenderCounter';
import withAnalyticsEvents, {
  WithAnalyticsEventsProps,
} from '../../withAnalyticsEvents';

const FakeContextProvider = ({
  onEvent,
  data,
  children,
}: {
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  data: Record<string, any>;
  children: React.ReactNode;
}) => {
  const dataRef = useTrackedRef(data);
  const onEventRef = useTrackedRef(onEvent);

  const value = useMemo(
    () => ({
      getAtlaskitAnalyticsContext: () => [dataRef.current],
      getAtlaskitAnalyticsEventHandlers: () => [onEventRef.current],
    }),
    [onEventRef, dataRef],
  );

  return (
    <AnalyticsReactContext.Provider value={value}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

describe('withAnalyticsEvents', () => {
  it('should forward the ref to the wrapped component', () => {
    const ButtonToBeWrapped = forwardRef<HTMLButtonElement, {}>(
      (_props, ref) => {
        return <button ref={ref}>Button</button>;
      },
    );

    const WrappedButton = withAnalyticsEvents()(ButtonToBeWrapped);

    const UnderTest = ({ callback }: any) => {
      const buttonRef = createRef();

      useEffect(() => {
        callback(buttonRef.current);
      }, [buttonRef, callback]);

      return <WrappedButton ref={buttonRef} />;
    };

    const callback = jest.fn();

    const { getByText } = render(<UnderTest callback={callback} />);

    expect(callback).toBeCalledWith(getByText('Button'));
  });

  it("should include the wrapped component's name in the wrapped name", () => {
    const Button = () => <button>Button</button>;
    Button.displayName = 'Button';

    const WrappedButton = withAnalyticsEvents()(Button);

    expect(WrappedButton.displayName).toBe('WithAnalyticsEvents(Button)');
  });

  describe('for wrapped callbacks via createEventMap', () => {
    const ButtonToBeWrapped = memo(
      ({
        onClick,
      }: {
        onClick: (
          e: React.MouseEvent<HTMLButtonElement>,
          analyticsEvent?: UIAnalyticsEvent,
        ) => void;
      } & WithAnalyticsEventsProps) => {
        const renderCounter = useRenderCounter();

        return (
          <button data-render-count={renderCounter} onClick={onClick}>
            Button
          </button>
        );
      },
    );

    const WrappedButton = withAnalyticsEvents({
      onClick: { action: 'clicked', component: 'Button' },
    })(ButtonToBeWrapped);

    const UnderTest = ({
      onEvent,
      onClick,
      contextData,
    }: {
      onClick: (
        e: React.MouseEvent<HTMLButtonElement>,
        analyticsEvent?: UIAnalyticsEvent,
      ) => void;
      onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
      contextData: Record<string, any>;
    }) => {
      return (
        <FakeContextProvider onEvent={onEvent} data={contextData}>
          <WrappedButton onClick={onClick} />
        </FakeContextProvider>
      );
    };

    it('should render the wrapped component with an analytics wrapped callback', () => {
      const callback = jest.fn();

      const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
        callback(analyticsEvt.payload, analyticsEvt.context, channel);
      };

      const onClick = (
        _clickEvent: React.MouseEvent<HTMLButtonElement>,
        analyticsEvent?: UIAnalyticsEvent,
      ) => {
        analyticsEvent && analyticsEvent.fire('atlaskit');
      };

      const { getByText } = render(
        <UnderTest
          onEvent={onEvent}
          contextData={{ ticket: 'AFP-123' }}
          onClick={onClick}
        />,
      );

      expect(getByText('Button').dataset.renderCount).toBe('1');

      fireEvent.click(getByText('Button'));

      expect(callback).toBeCalledWith(
        { action: 'clicked', component: 'Button' },
        [{ ticket: 'AFP-123' }],
        'atlaskit',
      );
    });
  });

  describe('for using createAnalyticsEvent directly', () => {
    const ButtonToBeWrapped = memo(
      ({
        createAnalyticsEvent,
        payload,
      }: { payload: Record<string, any> } & WithAnalyticsEventsProps) => {
        const renderCounter = useRenderCounter();

        const onClick = useCallback(() => {
          if (createAnalyticsEvent) {
            const analyticsEvent = createAnalyticsEvent(payload);
            analyticsEvent.fire('atlaskit');
          }
        }, [createAnalyticsEvent, payload]);

        return (
          <button data-render-count={renderCounter} onClick={onClick}>
            Button
          </button>
        );
      },
    );

    const WrappedButton = withAnalyticsEvents()(ButtonToBeWrapped);

    const UnderTest = ({
      onEvent,
      contextData,
      payload,
    }: {
      onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
      contextData: Record<string, any>;
      payload: Record<string, any>;
    }) => {
      return (
        <FakeContextProvider onEvent={onEvent} data={contextData}>
          <WrappedButton payload={payload} />Î
        </FakeContextProvider>
      );
    };

    it('should provide createAnalyticsEvent to the wrapped component', () => {
      const callback = jest.fn();

      const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
        callback(analyticsEvt.payload, analyticsEvt.context, channel);
      };

      const contextData = { ticket: 'AFP-123' };

      const payload = {
        action: 'clicked',
        component: 'Button',
      };

      const { getByText } = render(
        <UnderTest
          onEvent={onEvent}
          contextData={contextData}
          payload={payload}
        />,
      );

      expect(getByText('Button').dataset.renderCount).toBe('1');

      fireEvent.click(getByText('Button'));

      expect(callback).toBeCalledWith(
        { action: 'clicked', component: 'Button' },
        [{ ticket: 'AFP-123' }],
        'atlaskit',
      );
    });

    it('should not re-render wrapped component when analytics context is updated but should if its own props change', () => {
      const initialCallback = jest.fn();

      const initialOnEvent = (
        analyticsEvt: UIAnalyticsEvent,
        channel: string,
      ) => {
        initialCallback(analyticsEvt.payload, analyticsEvt.context, channel);
      };

      const initialContextData = { ticket: 'AFP-123' };

      const intialPayload = {
        action: 'clicked',
        component: 'Button',
      };

      const { getByText, rerender } = render(
        <UnderTest
          onEvent={initialOnEvent}
          contextData={initialContextData}
          payload={intialPayload}
        />,
      );

      expect(getByText('Button').dataset.renderCount).toBe('1');

      fireEvent.click(getByText('Button'));

      expect(initialCallback).toBeCalledWith(
        { action: 'clicked', component: 'Button' },
        [{ ticket: 'AFP-123' }],
        'atlaskit',
      );
      initialCallback.mockReset();

      const updatedContextData = {
        ticket: 'AFP-234',
      };

      rerender(
        <UnderTest
          onEvent={initialOnEvent}
          contextData={updatedContextData}
          payload={intialPayload}
        />,
      );

      expect(getByText('Button').dataset.renderCount).toBe('1');

      fireEvent.click(getByText('Button'));

      expect(initialCallback).toBeCalledWith(
        { action: 'clicked', component: 'Button' },
        [{ ticket: 'AFP-234' }],
        'atlaskit',
      );

      const updatedCallback = jest.fn();

      const updatedOnEvent = (
        analyticsEvt: UIAnalyticsEvent,
        channel: string,
      ) => {
        updatedCallback(analyticsEvt.payload, analyticsEvt.context, channel);
      };

      rerender(
        <UnderTest
          onEvent={updatedOnEvent}
          contextData={updatedContextData}
          payload={intialPayload}
        />,
      );

      expect(getByText('Button').dataset.renderCount).toBe('1');

      fireEvent.click(getByText('Button'));

      expect(updatedCallback).toBeCalledWith(
        { action: 'clicked', component: 'Button' },
        [{ ticket: 'AFP-234' }],
        'atlaskit',
      );
      updatedCallback.mockReset();

      const updatedPayload = {
        action: 'clicked',
        component: 'Button',
        magic: 'yes',
      };

      rerender(
        <UnderTest
          onEvent={updatedOnEvent}
          contextData={updatedContextData}
          payload={updatedPayload}
        />,
      );

      expect(getByText('Button').dataset.renderCount).toBe('2');

      fireEvent.click(getByText('Button'));

      expect(updatedCallback).toBeCalledWith(
        { action: 'clicked', component: 'Button', magic: 'yes' },
        [{ ticket: 'AFP-234' }],
        'atlaskit',
      );
    });
  });
});
