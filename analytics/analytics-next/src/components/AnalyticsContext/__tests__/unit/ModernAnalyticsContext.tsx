import React, { memo, useCallback, useMemo } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

import { useAnalyticsContext } from '../../../../hooks/useAnalyticsContext';
import { useRenderCounter } from '../../../../test-utils/useRenderCounter';
import ModernAnalyticsContext from '../../ModernAnalyticsContext';

const FakeModernListener = ({
  children,
  callback,
}: {
  children: React.ReactNode;
  callback: (context: Record<string, any>) => void;
}) => {
  const value = useMemo(
    () => ({
      getAtlaskitAnalyticsContext: () => [],
      getAtlaskitAnalyticsEventHandlers: () => [callback],
    }),
    [callback],
  );

  return (
    <AnalyticsReactContext.Provider value={value}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

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
}: {
  data: Record<string, any>;
  callback: (context: Record<string, any>) => void;
}) => {
  return (
    <FakeModernListener callback={callback}>
      <ModernAnalyticsContext data={data}>
        <FakeModernConsumerButton />
      </ModernAnalyticsContext>
    </FakeModernListener>
  );
};

const UnderTestTwoContexts = ({
  innerData,
  outerData,
  callback,
}: {
  outerData: Record<string, any>;
  innerData: Record<string, any>;
  callback: (context: Record<string, any>) => void;
}) => {
  return (
    <FakeModernListener callback={callback}>
      <ModernAnalyticsContext data={outerData}>
        <ModernAnalyticsContext data={innerData}>
          <FakeModernConsumerButton />
        </ModernAnalyticsContext>
      </ModernAnalyticsContext>
    </FakeModernListener>
  );
};

describe('ModernAnalyticsContext', () => {
  it('should provide context to children', () => {
    const callback = jest.fn();

    const { getByText } = render(
      <UnderTestSingleContext
        data={{ ticket: 'AFP-123' }}
        callback={callback}
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
      />,
    );

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith([{ board: 'AFP' }, { ticket: 'AFP-123' }]);
    expect(getByText('Button').dataset.renderCount).toBe('1');
  });

  it('should prevent rerenders when data changes but always have access to the latest context', () => {
    const callback = jest.fn();
    const dataObject = { ticket: 'AFP-123' };

    const { rerender, getByText } = render(
      <UnderTestSingleContext data={dataObject} callback={callback} />,
    );

    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith([{ ticket: 'AFP-123' }]);
    callback.mockReset();

    rerender(<UnderTestSingleContext data={dataObject} callback={callback} />);

    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith([{ ticket: 'AFP-123' }]);
    callback.mockReset();

    rerender(
      <UnderTestSingleContext
        data={{ ticket: 'AFP-234' }}
        callback={callback}
      />,
    );

    expect(getByText('Button').dataset.renderCount).toBe('1');

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith([{ ticket: 'AFP-234' }]);
  });
});
