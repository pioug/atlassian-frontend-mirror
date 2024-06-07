import React from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import LegacyAnalyticsListener from './LegacyAnalyticsListener';
import ModernAnalyticsListener from './ModernAnalyticsListener';
import { type AnalyticsListenerFunction } from './types';

const ExportedAnalyticsListener: AnalyticsListenerFunction = (props) => {
	const isModernContextEnabledEnv =
		typeof process !== 'undefined' &&
		process !== null &&
		process.env?.['ANALYTICS_NEXT_MODERN_CONTEXT'];

	return isModernContextEnabledEnv ||
		getBooleanFF('platform.analytics-next-use-modern-context_fqgbx') ? (
		<ModernAnalyticsListener {...props} />
	) : (
		<LegacyAnalyticsListener {...props} />
	);
};

export default ExportedAnalyticsListener;
