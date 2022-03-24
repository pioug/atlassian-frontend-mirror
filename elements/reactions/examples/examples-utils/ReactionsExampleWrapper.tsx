import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { AnalyticsViewerContainer } from '@atlaskit/analytics-viewer';
import {
  ReactionClient,
  MemoryReactionsStore,
  ReactionsStore,
} from '../../src';
import { MockReactionsClient } from '../../src/client/MockReactionsClient';

export type Props = {
  client?: ReactionClient;
  children:
    | ((store: ReactionsStore) => React.ReactChild | React.ReactChild[])
    | React.ReactChild
    | React.ReactChild[];
};

/**
 * A wrapper component to provide a store of resouces/reactions to the wrapper UI element.
 */
export const ReactionsExampleWrapper: React.FC<Props> = ({
  children,
  client = new MockReactionsClient(500),
}) => {
  const store = new MemoryReactionsStore(client!, undefined, {
    subproduct: 'atlaskit',
  }); // default props is handling it

  return (
    <IntlProvider locale="en">
      <AnalyticsViewerContainer>
        {children instanceof Function ? children(store) : children}
      </AnalyticsViewerContainer>
    </IntlProvider>
  );
};
