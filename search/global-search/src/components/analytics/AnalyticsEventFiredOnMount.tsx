import React from 'react';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { DEFAULT_GAS_CHANNEL } from '../../util/analytics-util';
import { CreateAnalyticsEventFn } from './types';

export type PayloadProvider = () => GasPayload;

export interface Props {
  payloadProvider: PayloadProvider;
  onEventFired: Function;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
}

export class UnwrappedAnalyticsEventFiredOnMount extends React.Component<
  Props
> {
  componentDidMount() {
    if (this.props.createAnalyticsEvent) {
      const event = this.props.createAnalyticsEvent({});
      event.update(this.props.payloadProvider()).fire(DEFAULT_GAS_CHANNEL);
      this.props.onEventFired();
    }
  }
  render() {
    return null;
  }
}

export default withAnalyticsEvents()(UnwrappedAnalyticsEventFiredOnMount);
