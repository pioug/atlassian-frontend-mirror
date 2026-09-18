import React from 'react';

import { injectIntl, IntlProvider, type WrappedComponentProps } from 'react-intl';

import withAnalyticsContext, {
	type WithContextProps,
} from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import { context } from '../../utils/analytics/analytics';
import { CardWithURLRenderer } from '../CardWithUrl/loader';
import { type CardAppearance, type CardPlatform, type CardProps } from './types';

class PlainCard extends React.PureComponent<CardProps & WrappedComponentProps> {
	render() {
		const content = <CardWithURLRenderer {...this.props} />;

		return this.props.intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
	}
}

export const Card: React.ForwardRefExoticComponent<
	Omit<
		Omit<
			Omit<CardProps & WrappedComponentProps, 'intl'> & {
				forwardedRef?: React.Ref<any>;
			},
			keyof WithAnalyticsEventsProps
		> &
			React.RefAttributes<any> &
			WithContextProps,
		'ref'
	> &
		React.RefAttributes<any>
> = withAnalyticsContext(context)(
	withAnalyticsEvents()(injectIntl(PlainCard, { enforceContext: false })),
);

export type { CardAppearance, CardProps, CardPlatform };
