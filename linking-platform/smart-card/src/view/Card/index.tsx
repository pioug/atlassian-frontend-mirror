import React from 'react';

import { injectIntl, IntlProvider, type WrappedComponentProps } from 'react-intl-next';

import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';

import { isCardWithData } from '../../utils';
import { context } from '../../utils/analytics';
import { CardWithDataRenderer } from '../CardWithData/loader';
import { CardWithURLRenderer } from '../CardWithUrl/loader';

import { type CardAppearance, type CardPlatform, type CardProps } from './types';

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
