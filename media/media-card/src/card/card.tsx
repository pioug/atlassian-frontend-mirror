import React from 'react';

import { injectIntl } from 'react-intl';

import { withMediaAnalyticsContext } from '@atlaskit/media-common';

import type { CardBaseProps } from './CardBase';
import { CardWithPerformanceObserver } from './CardWithPerformanceObserver';

const packageName = process.env._PACKAGE_NAME_ as string;

const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const Card: React.ComponentType<CardBaseProps> = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'mediaCard',
	component: 'mediaCard',
})(
	injectIntl(CardWithPerformanceObserver, {
		enforceContext: false,
	}),
);
