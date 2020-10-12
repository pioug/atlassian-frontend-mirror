import { AnalyticsViewerContainer } from '@atlaskit/analytics-viewer';
import React from 'react';
import { ReactionClient } from '../../src';
import { MockReactionsClient } from '../../src/client/MockReactionsClient';
import {
  MemoryReactionsStore,
  ReactionsStore,
} from '../../src/reaction-store/ReactionsStore';

export type Props = {
  client?: ReactionClient;
  children:
    | ((store: ReactionsStore) => React.ReactChild | React.ReactChild[])
    | React.ReactChild
    | React.ReactChild[];
};

export class ReactionsExampleWrapper extends React.PureComponent<Props> {
  static defaultProps = {
    client: new MockReactionsClient(500),
  };
  private store: ReactionsStore;

  constructor(props: Props, context: any) {
    super(props, context);
    this.store = new MemoryReactionsStore(this.props.client!); // default props is handling it
  }

  renderChildren = () => {
    if (this.props.children instanceof Function) {
      return this.props.children(this.store);
    }
    return this.props.children;
  };

  render() {
    return (
      <AnalyticsViewerContainer>
        {this.renderChildren()}
      </AnalyticsViewerContainer>
    );
  }
}
