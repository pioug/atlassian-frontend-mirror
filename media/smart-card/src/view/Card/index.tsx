import React from 'react';
import {
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { CardAppearance, CardPlatform, CardProps } from './types';
import { CardWithDataRenderer } from '../CardWithData/loader';
import { CardWithURLRenderer } from '../CardWithUrl/loader';
import { isCardWithData } from '../../utils';
import { context } from '../../utils/analytics';

class PlainCard extends React.PureComponent<CardProps> {
  render() {
    return isCardWithData(this.props) ? (
      <CardWithDataRenderer {...this.props} />
    ) : (
      <CardWithURLRenderer {...this.props} />
    );
  }
}

export const Card = withAnalyticsContext(context)(
  withAnalyticsEvents()(PlainCard),
);

export type { CardAppearance, CardProps, CardPlatform };
