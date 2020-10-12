import React, { useEffect } from 'react';

import { render } from '@testing-library/react';

import {
  default as AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

import { useAnalyticsContext } from '../../useAnalyticsContext';

const FakeContextProvider = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context: AnalyticsReactContextInterface;
}) => {
  return (
    <AnalyticsReactContext.Provider value={context}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

const ComponentUsingHook = ({
  callback,
}: {
  callback: (context: AnalyticsReactContextInterface) => void;
}) => {
  const analyticsContext = useAnalyticsContext();
  useEffect(() => {
    callback(analyticsContext);
  });
  return null;
};

const UnderTest = ({
  callback,
  context,
}: {
  callback: (context: AnalyticsReactContextInterface) => void;
  context: AnalyticsReactContextInterface;
}) => {
  return (
    <FakeContextProvider context={context}>
      <ComponentUsingHook callback={callback} />
    </FakeContextProvider>
  );
};

describe('useAnalyticsContext', () => {
  it('should return analytics context', () => {
    const callback = jest.fn();
    const context: AnalyticsReactContextInterface = {
      getAtlaskitAnalyticsContext: () => [],
      getAtlaskitAnalyticsEventHandlers: () => [],
    };

    render(<UnderTest callback={callback} context={context} />);

    expect(callback).toBeCalledWith(context);
  });
});
