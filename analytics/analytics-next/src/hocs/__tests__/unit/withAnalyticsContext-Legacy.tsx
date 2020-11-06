import React, {
  Component,
  createRef,
  forwardRef,
  memo,
  PureComponent,
  useCallback,
  useEffect,
} from 'react';

import { fireEvent, render } from '@testing-library/react';
import PropTypes from 'prop-types';

import UIAnalyticsEvent from '../../../events/UIAnalyticsEvent';
import { useAnalyticsEvents } from '../../../hooks/useAnalyticsEvents';
import { useRenderCounter } from '../../../test-utils/useRenderCounter';
import withAnalyticsContext from '../../withAnalyticsContext';

jest.mock('../../../components/AnalyticsContext', () => {
  const {
    default: LegacyAnalyticsContext,
  } = require('../../../components/AnalyticsContext/LegacyAnalyticsContext');
  return {
    __esModule: true,
    default: LegacyAnalyticsContext,
  };
});

// eslint-disable-next-line @repo/internal/react/no-class-components
class FakeLegacyListener extends Component<{
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  children: React.ReactElement;
}> {
  static childContextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  };

  getChildContext = () => ({
    getAtlaskitAnalyticsEventHandlers: this.getAtlaskitAnalyticsEventHandlers,
  });

  getAtlaskitAnalyticsEventHandlers = () => {
    const { onEvent } = this.props;
    return [onEvent];
  };

  render() {
    return this.props.children;
  }
}

const ContainerToBeWrapped = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  const renderCounter = useRenderCounter();

  return (
    <div data-render-count={renderCounter} ref={ref}>
      {children}
    </div>
  );
});

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

// eslint-disable-next-line @repo/internal/react/no-class-components
class FakeLegacyConsumer extends PureComponent<{}> {
  renderCounter: number;

  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    getAtlaskitAnalyticsContext: PropTypes.func,
  };

  constructor(props: {}) {
    super(props);
    this.renderCounter = 0;
  }

  onClick = () => {
    const {
      getAtlaskitAnalyticsContext,
      getAtlaskitAnalyticsEventHandlers,
    } = this.context;
    const analyticsEvent = new UIAnalyticsEvent({
      context: getAtlaskitAnalyticsContext(),
      handlers: getAtlaskitAnalyticsEventHandlers(),
      payload: { action: 'click' },
    });
    analyticsEvent.fire('atlaskit');
  };

  render() {
    this.renderCounter++;
    return (
      <button
        data-render-count={this.renderCounter}
        data-testid="button"
        onClick={this.onClick}
      >
        Button
      </button>
    );
  }
}

const UnderTestSingleContext = ({
  onEvent,
  FakeConsumer,
  analyticsContext,
}: {
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  FakeConsumer: React.JSXElementConstructor<{}>;
  analyticsContext?: Record<string, any>;
}) => {
  return (
    <FakeLegacyListener onEvent={onEvent}>
      <WrappedContainerOne analyticsContext={analyticsContext}>
        <FakeConsumer />
      </WrappedContainerOne>
    </FakeLegacyListener>
  );
};

const UnderTestManyContext = ({
  onEvent,
  FakeConsumer,
  outerAnalyticsContext,
  innerAnalyticsContext,
}: {
  onEvent: (analyticsEvt: UIAnalyticsEvent, channel: string) => void;
  FakeConsumer: React.JSXElementConstructor<{}>;
  innerAnalyticsContext?: Record<string, any>;
  outerAnalyticsContext?: Record<string, any>;
}) => {
  return (
    <FakeLegacyListener onEvent={onEvent}>
      <WrappedContainerTwo analyticsContext={outerAnalyticsContext}>
        <WrappedContainerOne analyticsContext={innerAnalyticsContext}>
          <FakeConsumer />
        </WrappedContainerOne>
      </WrappedContainerTwo>
    </FakeLegacyListener>
  );
};

describe('withAnalyticsContext LegacyContext', () => {
  type TestBranch = {
    FakeConsumer: React.JSXElementConstructor<{}>;
    description: string;
  };

  const branches: TestBranch[] = [
    {
      FakeConsumer: FakeLegacyConsumer,
      description: 'when wrapping legacy context components',
    },
    {
      FakeConsumer: FakeModernConsumer,
      description: 'when wrapping modern context components',
    },
  ];

  branches.forEach(({ FakeConsumer, description }) => {
    describe(description, () => {
      it('should render the wrapped component', () => {
        const { getByTestId } = render(
          <UnderTestSingleContext
            onEvent={() => null}
            FakeConsumer={FakeConsumer}
          />,
        );

        expect(getByTestId('button').textContent).toBe('Button');
      });

      it('should provide analytics context via default data to children', () => {
        const callback = jest.fn();

        const onEvent = (analyticsEvt: UIAnalyticsEvent, channel: string) => {
          callback(analyticsEvt.payload, analyticsEvt.context, channel);
        };

        const { getByTestId } = render(
          <UnderTestSingleContext
            onEvent={onEvent}
            FakeConsumer={FakeConsumer}
          />,
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
            FakeConsumer={FakeConsumer}
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
          <UnderTestManyContext
            onEvent={onEvent}
            FakeConsumer={FakeConsumer}
          />,
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
            FakeConsumer={FakeConsumer}
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
          <UnderTestSingleContext
            onEvent={() => {}}
            FakeConsumer={FakeConsumer}
          />,
        );

        expect(getByTestId('button').dataset.renderCount).toBe('1');

        rerender(
          <UnderTestSingleContext
            onEvent={() => {}}
            FakeConsumer={FakeConsumer}
          />,
        );

        expect(getByTestId('button').dataset.renderCount).toBe('1');

        rerender(
          <UnderTestSingleContext
            onEvent={() => {}}
            FakeConsumer={FakeConsumer}
            analyticsContext={{ board: 'AFPAI' }}
          />,
        );

        expect(getByTestId('button').dataset.renderCount).toBe('1');
      });
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
});
