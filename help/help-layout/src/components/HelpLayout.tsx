import React from 'react';

import withAnalyticsContext, {
	type WithContextProps,
} from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import { defaultAnalyticsAttributes } from '../analytics';
import { type HelpLayout as HelpLayoutProps } from '../model/HelpLayout';
import HelpContent from './HelpLayoutContent';
import MessagesIntlProvider from './MessagesIntlProvider';

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
