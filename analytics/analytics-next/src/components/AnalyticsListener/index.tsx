import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import isModernContextEnabledEnv from '../../utils/isModernContextEnabledEnv';

import LegacyAnalyticsListener from './LegacyAnalyticsListener';
import ModernAnalyticsListener from './ModernAnalyticsListener';
import { type AnalyticsListenerFunction } from './types';

const AnalyticsListener: AnalyticsListenerFunction = (props) => {
	const isModernContext = isModernContextEnabledEnv || fg('analytics-next-use-legacy-context') === false;

	return isModernContext ? (
		<ModernAnalyticsListener {...props} />
	) : (
		<LegacyAnalyticsListener {...props} />
	);
};

export default AnalyticsListener;
