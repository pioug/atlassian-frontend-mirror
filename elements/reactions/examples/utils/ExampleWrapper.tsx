import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { AnalyticsViewerContainer } from '@atlaskit/analytics-viewer';
import { MockReactionsClient } from '../../src/MockReactionsClient';
import {
  type ReactionsStore,
  type ReactionClient,
  MemoryReactionsStore,
} from '../../src';

export interface ExampleWrapperProps {
  /**
   * Caller client object
   */
  client?: ReactionClient;
  /**
   * Show the user analytics viewer
   */
  showAnalytics?: boolean;
  /**
   *
   */
  children:
    | ((store: ReactionsStore) => React.ReactChild | React.ReactChild[])
    | React.ReactChild
    | React.ReactChild[];
}

/**
 * A wrapper component to provide a store of resouces/reactions to the wrapper UI element.
 */
export const ExampleWrapper = ({
  children,
  showAnalytics = false,
  client = new MockReactionsClient(500),
}: ExampleWrapperProps) => {
  const store = new MemoryReactionsStore(client, undefined, {
    subproduct: 'atlaskit',
  }); // default props is handling it

  return (
    <IntlProvider locale="en">
      {showAnalytics ? (
        <AnalyticsViewerContainer>
          {children instanceof Function ? children(store) : children}
        </AnalyticsViewerContainer>
      ) : children instanceof Function ? (
        children(store)
      ) : (
        children
      )}
    </IntlProvider>
  );
};
