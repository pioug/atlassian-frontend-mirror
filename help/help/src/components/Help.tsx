import React from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import { defaultAnalyticsAttributes } from '../analytics';
import { Help as HelpInterface } from '../model/Help';

import { HelpContextProvider } from './HelpContext';
import MessagesIntlProvider from './MessagesIntlProvider';

import HelpContent from './HelpContent';

export type Props = HelpInterface & WithAnalyticsEventsProps;

export class Help extends React.PureComponent<Props> {
  render() {
    const { children, ...rest } = this.props;
    return (
      <HelpContextProvider {...rest} defaultContent={children}>
        <MessagesIntlProvider>
          <HelpContent />
        </MessagesIntlProvider>
      </HelpContextProvider>
    );
  }
}

export default withAnalyticsContext(defaultAnalyticsAttributes)(
  withAnalyticsEvents()(Help),
);
