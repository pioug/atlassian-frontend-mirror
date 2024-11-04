import React from 'react';

import { injectIntl, IntlProvider, type WrappedComponentProps } from 'react-intl-next';

import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';

import { context } from '../../utils/analytics';
import { CardWithURLRenderer } from '../CardWithUrl/loader';

import { type CardAppearance, type CardPlatform, type CardProps } from './types';

class PlainCard extends React.PureComponent<CardProps & WrappedComponentProps> {
	render() {
		const content = <CardWithURLRenderer {...this.props} />;

		return this.props.intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
	}
}

export const Card = withAnalyticsContext(context)(
	withAnalyticsEvents()(injectIntl(PlainCard, { enforceContext: false })),
);

export type { CardAppearance, CardProps, CardPlatform };
