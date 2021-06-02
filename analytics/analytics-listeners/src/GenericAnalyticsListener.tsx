import React from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEvent,
  UIAnalyticsEventHandler,
} from '@atlaskit/analytics-next';

import { sendEvent } from './analytics-web-client-wrapper';
import { ListenerProps, FabricChannel } from './types';
import Logger from './helpers/logger';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

type Props = ListenerProps & {
  channel: FabricChannel | string;
  processEvent: (
    event: UIAnalyticsEvent,
    logger: Logger,
  ) => GasPayload | GasScreenEventPayload | null;
};

export default class GenericAnalyticsListener extends React.Component<Props> {
  listenerHandler: UIAnalyticsEventHandler = (event) => {
    const { client, logger, channel, processEvent } = this.props;
    if (!event.payload) {
      return;
    }

    logger.debug(`Received ${channel} event`, event);
    const payload = processEvent(event, logger);
    logger.debug(`Processed ${channel} event`, payload);

    if (payload) {
      sendEvent(logger, client)(payload);
    }
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={this.props.channel}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
