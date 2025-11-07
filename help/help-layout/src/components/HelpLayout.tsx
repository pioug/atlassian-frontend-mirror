import React from 'react';
import {
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
	withAnalyticsContext,
	type WithContextProps,
} from '@atlaskit/analytics-next';
import { defaultAnalyticsAttributes } from '../analytics';
import { type HelpLayout as HelpLayoutProps } from '../model/HelpLayout';

import MessagesIntlProvider from './MessagesIntlProvider';

import HelpContent from './HelpLayoutContent';

export type Props = HelpLayoutProps & WithAnalyticsEventsProps;

export class HelpLayout extends React.PureComponent<Props> {
	render(): React.JSX.Element {
		return (
			<MessagesIntlProvider>
				<HelpContent {...this.props} />
			</MessagesIntlProvider>
		);
	}
}

const _default_1: React.ForwardRefExoticComponent<
	Omit<
		Omit<HelpLayoutProps, keyof WithAnalyticsEventsProps> &
			React.RefAttributes<any> &
			WithContextProps,
		'ref'
	> &
		React.RefAttributes<any>
> = withAnalyticsContext(defaultAnalyticsAttributes)(withAnalyticsEvents()(HelpLayout));
export default _default_1;
