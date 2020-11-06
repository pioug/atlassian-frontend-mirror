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
import { useAnalyticsEvents } from '../../../hooks/useAnalyticsEvents';
import { useTrackedRef } from '../../../hooks/useTrackedRef';
import { useRenderCounter } from '../../../test-utils/useRenderCounter';
import withAnalyticsContext from '../../withAnalyticsContext';

jest.mock('../../../components/AnalyticsContext', () => {
  const ModernAnalyticsContext = require('../../../components/AnalyticsContext/ModernAnalyticsContext');
  return {
    __esModule: true,
    default: ModernAnalyticsContext.default,
  };
});

const FakeModernListener = ({
  onEvent,
  children,
}: {
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  children: React.ReactElement;
}) => {
  const onEventRef = useTrackedRef(onEvent);

  const value = useMemo(
    () => ({
      getAtlaskitAnalyticsEventHandlers: () => [onEventRef.current],
      getAtlaskitAnalyticsContext: () => [],
    }),
    [onEventRef],
  );

  return (
    <AnalyticsReactContext.Provider value={value}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

const ContainerToBeWrapped = forwardRef<any, any>(
  ({ children, dataId }, ref) => {
    const renderCounter = useRenderCounter();

    return (
      <div data-render-count={renderCounter} data-testid={dataId} ref={ref}>
        {children}
      </div>
    );
  },
);

const WrappedContainerOne = withAnalyticsContext({ ticket: 'AFP-123' })(
  ContainerToBeWrapped,
);

const WrappedContainerTwo = withAnalyticsContext({ board: 'AFPAI' })(
  ContainerToBeWrapped,
);

const FakeModernConsumer = memo<{}>(() => {
  const renderCounter = useRenderCounter();
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const onClick = useCallback(() => {
    const analyticsEvent = createAnalyticsEvent({ action: 'click' });
    analyticsEvent.fire('atlaskit');
  }, [createAnalyticsEvent]);

  return (
    <button
      data-render-count={renderCounter}
      data-testid="button"
      onClick={onClick}
    >
      Button
    </button>
  );
});

const UnderTestSingleContext = ({
  onEvent,
  analyticsContext,
}: {
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  analyticsContext?: Record<string, any>;
}) => {
  return (
    <FakeModernListener onEvent={onEvent}>
      <WrappedContainerOne analyticsContext={analyticsContext}>
        <FakeModernConsumer />
      </WrappedContainerOne>
    </FakeModernListener>
  );
};

const UnderTestManyContext = ({
  onEvent,
  outerAnalyticsContext,
  innerAnalyticsContext,
}: {
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  innerAnalyticsContext?: Record<string, any>;
  outerAnalyticsContext?: Record<string, any>;
}) => {
  return (
    <FakeModernListener onEvent={onEvent}>
      <WrappedContainerTwo analyticsContext={outerAnalyticsContext}>
        <WrappedContainerOne analyticsContext={innerAnalyticsContext}>
          <FakeModernConsumer />
        </WrappedContainerOne>
      </WrappedContainerTwo>
    </FakeModernListener>
  );
};

describe('withAnalyticsContext ModernContext', () => {
  it('should render the wrapped component', () => {
    const { getByTestId } = render(
      <UnderTestSingleContext onEvent={() => null} />,
    );

    expect(getByTestId('button').textContent).toBe('Button');
  });

  it('should provide analytics context via default data to children', () => {
    const callback = jest.fn();

    const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
      callback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const { getByTestId } = render(
      <UnderTestSingleContext onEvent={onEvent} />,
    );

    fireEvent.click(getByTestId('button'));

    expect(callback).toBeCalledWith(
      { action: 'click' },
      [{ ticket: 'AFP-123' }],
      'atlaskit',
    );
  });

  it('should provide analytics context via the anayticsContext prop to children', () => {
    const callback = jest.fn();

    const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
      callback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const analyticsContext = { board: 'AFPAI' };

    const { getByTestId } = render(
      <UnderTestSingleContext
        onEvent={onEvent}
        analyticsContext={analyticsContext}
      />,
    );

    fireEvent.click(getByTestId('button'));

    expect(callback).toBeCalledWith(
      { action: 'click' },
      [{ board: 'AFPAI', ticket: 'AFP-123' }],
      'atlaskit',
    );
  });

  it('should provide analytics context work with many contexts to children', () => {
    const callback = jest.fn();

    const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
      callback(analyticsEvt.payload, analyticsEvt.context, channel);
    };

    const { getByTestId, rerender } = render(
      <UnderTestManyContext onEvent={onEvent} />,
    );

    fireEvent.click(getByTestId('button'));

    expect(callback).toBeCalledWith(
      { action: 'click' },
      [{ board: 'AFPAI' }, { ticket: 'AFP-123' }],
      'atlaskit',
    );
    callback.mockClear();

    rerender(
      <UnderTestManyContext
        onEvent={onEvent}
        outerAnalyticsContext={{ outer: 'outerValue' }}
        innerAnalyticsContext={{ inner: 'innerValue' }}
      />,
    );

    fireEvent.click(getByTestId('button'));

    expect(callback).toBeCalledWith(
      { action: 'click' },
      [
        { board: 'AFPAI', outer: 'outerValue' },
        { ticket: 'AFP-123', inner: 'innerValue' },
      ],
      'atlaskit',
    );
  });

  it('should not re-render consumer components when analytics-context changes', () => {
    const { getByTestId, rerender } = render(
      <UnderTestSingleContext onEvent={() => {}} />,
    );

    expect(getByTestId('button').dataset.renderCount).toBe('1');

    rerender(<UnderTestSingleContext onEvent={() => {}} />);

    expect(getByTestId('button').dataset.renderCount).toBe('1');

    rerender(
      <UnderTestSingleContext
        onEvent={() => {}}
        analyticsContext={{ board: 'AFPAI' }}
      />,
    );

    expect(getByTestId('button').dataset.renderCount).toBe('1');
  });

  it('should forward the ref to the wrapped component', () => {
    const ContainerToBeWrapped = forwardRef<
      HTMLDivElement,
      { children: React.ReactNode }
    >(({ children }, ref) => {
      return (
        <div ref={ref} data-testid="container">
          {children}
        </div>
      );
    });

    const WrappedContainer = withAnalyticsContext()(ContainerToBeWrapped);

    const UnderTest = ({ callback }: any) => {
      const divRef = createRef();

      useEffect(() => {
        callback(divRef.current);
      }, [divRef, callback]);

      return (
        <WrappedContainer ref={divRef}>
          <button>Button</button>
        </WrappedContainer>
      );
    };

    const callback = jest.fn();

    const { getByTestId } = render(<UnderTest callback={callback} />);

    expect(callback).toBeCalledWith(getByTestId('container'));
  });

  it("should include the wrapped component's name in the wrapped name", () => {
    const ContainerToBeWrapped = () => <div>Div</div>;
    ContainerToBeWrapped.displayName = 'Container';

    const WrappedContainer = withAnalyticsContext()(ContainerToBeWrapped);

    expect(WrappedContainer.displayName).toBe(
      'WithAnalyticsContext(Container)',
    );
  });
});
