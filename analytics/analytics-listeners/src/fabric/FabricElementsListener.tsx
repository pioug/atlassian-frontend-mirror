import React from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEventHandler,
} from '@atlaskit/analytics-next';
import { ListenerProps, FabricChannel } from '../types';

import { handleEvent } from './handle-event';

export const ELEMENTS_TAG = 'fabricElements';

export default class FabricElementsListener extends React.Component<
  ListenerProps
> {
  handleEventWrapper: UIAnalyticsEventHandler = (event) => {
    handleEvent(event, ELEMENTS_TAG, this.props.logger, this.props.client);
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.handleEventWrapper}
        channel={FabricChannel.elements}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
