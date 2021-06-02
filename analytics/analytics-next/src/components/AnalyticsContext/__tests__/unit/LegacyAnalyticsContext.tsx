import React, { Component, memo, PureComponent, useCallback } from 'react';

import { fireEvent, render } from '@testing-library/react';
import PropTypes from 'prop-types';

import { AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';

import { useAnalyticsContext } from '../../../../hooks/useAnalyticsContext';
import { useRenderCounter } from '../../../../test-utils/useRenderCounter';
import LegacyAnalyticsContext from '../../LegacyAnalyticsContext';

// eslint-disable-next-line @repo/internal/react/no-class-components
class FakeLegacyListener extends Component<{
  callback: (context: Record<string, any>) => void;
  children: React.ReactElement;
}> {
  static childContextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  };

  getChildContext = () => ({
    getAtlaskitAnalyticsEventHandlers: this.getAtlaskitAnalyticsEventHandlers,
  });

  getAtlaskitAnalyticsEventHandlers = () => {
    const { callback } = this.props;
    return [callback];
  };

  render() {
    return this.props.children;
  }
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class FakeLegacyConsumerButton extends PureComponent<{}> {
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
    }: AnalyticsReactContextInterface = this.context;

    const context = getAtlaskitAnalyticsContext();
    getAtlaskitAnalyticsEventHandlers().forEach((handler) => handler(context));
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

const FakeModernConsumerButton = memo(() => {
  const analyticsContext = useAnalyticsContext();
  const renderCounter = useRenderCounter();

  const onClick = useCallback(() => {
    const {
      getAtlaskitAnalyticsContext,
      getAtlaskitAnalyticsEventHandlers,
    } = analyticsContext;

    const context = getAtlaskitAnalyticsContext();
    getAtlaskitAnalyticsEventHandlers().forEach((handler) => handler(context));
  }, [analyticsContext]);

  return (
    <button data-render-count={renderCounter} onClick={onClick}>
      Button
    </button>
  );
});

const UnderTestSingleContext = ({
  data,
  callback,
  FakeConsumer,
}: {
  data: Record<string, any>;
  callback: (context: Record<string, any>) => void;
  FakeConsumer: React.JSXElementConstructor<{}>;
}) => {
  return (
    <FakeLegacyListener callback={callback}>
      <LegacyAnalyticsContext data={data}>
        <FakeConsumer />
      </LegacyAnalyticsContext>
    </FakeLegacyListener>
  );
};

const UnderTestTwoContexts = ({
  innerData,
  outerData,
  callback,
  FakeConsumer,
}: {
  outerData: Record<string, any>;
  innerData: Record<string, any>;
  callback: (context: Record<string, any>) => void;
  FakeConsumer: React.JSXElementConstructor<{}>;
}) => {
  return (
    <FakeLegacyListener callback={callback}>
      <LegacyAnalyticsContext data={outerData}>
        <LegacyAnalyticsContext data={innerData}>
          <FakeConsumer />
        </LegacyAnalyticsContext>
      </LegacyAnalyticsContext>
    </FakeLegacyListener>
  );
};

describe('LegacyAnalyticsContext', () => {
  type TestBranch = {
    FakeConsumer: React.JSXElementConstructor<{}>;
    description: string;
  };

  const branches: TestBranch[] = [
    {
      FakeConsumer: FakeLegacyConsumerButton,
      description: 'with legacy context consuming component children',
    },
    {
      FakeConsumer: FakeModernConsumerButton,
      description: 'with modern context consuming component children',
    },
  ];

  branches.forEach(({ FakeConsumer, description }) => {
    describe(description, () => {
      it('should provide context to children', () => {
        const callback = jest.fn();

        const { getByText } = render(
          <UnderTestSingleContext
            data={{ ticket: 'AFP-123' }}
            callback={callback}
            FakeConsumer={FakeConsumer}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(callback).toBeCalledWith([{ ticket: 'AFP-123' }]);
        expect(getByText('Button').dataset.renderCount).toBe('1');
      });

      it('should provide context including that from ancestors', () => {
        const callback = jest.fn();

        const { getByText } = render(
          <UnderTestTwoContexts
            outerData={{ board: 'AFP' }}
            innerData={{ ticket: 'AFP-123' }}
            callback={callback}
            FakeConsumer={FakeConsumer}
          />,
        );

        fireEvent.click(getByText('Button'));

        expect(callback).toBeCalledWith([
          { board: 'AFP' },
          { ticket: 'AFP-123' },
        ]);
        expect(getByText('Button').dataset.renderCount).toBe('1');
      });

      it('should prevent rerenders when data changes but always have access to the latest context', () => {
        const callback = jest.fn();
        const dataObject = { ticket: 'AFP-123' };

        const { rerender, getByText } = render(
          <UnderTestSingleContext
            data={dataObject}
            callback={callback}
            FakeConsumer={FakeConsumer}
          />,
        );

        expect(getByText('Button').dataset.renderCount).toBe('1');

        fireEvent.click(getByText('Button'));

        expect(callback).toBeCalledWith([{ ticket: 'AFP-123' }]);
        callback.mockReset();

        rerender(
          <UnderTestSingleContext
            data={dataObject}
            callback={callback}
            FakeConsumer={FakeConsumer}
          />,
        );

        expect(getByText('Button').dataset.renderCount).toBe('1');

        fireEvent.click(getByText('Button'));

        expect(callback).toBeCalledWith([{ ticket: 'AFP-123' }]);
        callback.mockReset();

        rerender(
          <UnderTestSingleContext
            data={{ ticket: 'AFP-234' }}
            callback={callback}
            FakeConsumer={FakeConsumer}
          />,
        );

        expect(getByText('Button').dataset.renderCount).toBe('1');

        fireEvent.click(getByText('Button'));

        expect(callback).toBeCalledWith([{ ticket: 'AFP-234' }]);
      });
    });
  });
});
