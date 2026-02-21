import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import isModernContextEnabledEnv from '../../utils/isModernContextEnabledEnv';

import LegacyAnalyticsContext from './LegacyAnalyticsContext';
import ModernAnalyticsContext from './ModernAnalyticsContext';
import { type AnalyticsContextFunction } from './types';

const AnalyticsContext: AnalyticsContextFunction = (props) => {
	const isModernContext =
		isModernContextEnabledEnv || fg('analytics-next-use-legacy-context') === false;

	return isModernContext ? (
		<ModernAnalyticsContext {...props} />
	) : (
		<LegacyAnalyticsContext {...props} />
	);
};

export default AnalyticsContext;
