import React from 'react';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import { type CardAppearance, type CardPlatform, type CardProps } from './types';
import { CardWithDataRenderer } from '../CardWithData/loader';
import { CardWithURLRenderer } from '../CardWithUrl/loader';
import { isCardWithData } from '../../utils';
import { context } from '../../utils/analytics';
import { injectIntl, type WrappedComponentProps, IntlProvider } from 'react-intl-next';

class PlainCard extends React.PureComponent<CardProps & WrappedComponentProps> {
	render() {
		const content = isCardWithData(this.props) ? (
			<CardWithDataRenderer {...this.props} />
		) : (
			<CardWithURLRenderer {...this.props} />
		);

		return this.props.intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
	}
}

export const Card = withAnalyticsContext(context)(
	withAnalyticsEvents()(injectIntl(PlainCard, { enforceContext: false })),
);

export type { CardAppearance, CardProps, CardPlatform };
