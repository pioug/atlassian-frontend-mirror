import React from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import { defaultAnalyticsAttributes } from '../analytics';
import { HelpLayout as HelpLayoutProps } from '../model/HelpLayout';

import MessagesIntlProvider from './MessagesIntlProvider';

import HelpContent from './HelpLayoutContent';

export type Props = HelpLayoutProps & WithAnalyticsEventsProps;

export class HelpLayout extends React.PureComponent<Props> {
  render() {
    return (
      <MessagesIntlProvider>
        <HelpContent {...this.props} />
      </MessagesIntlProvider>
    );
  }
}

export default withAnalyticsContext(defaultAnalyticsAttributes)(
  withAnalyticsEvents()(HelpLayout),
);
