import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import isModernContextEnabledEnv from '../../utils/isModernContextEnabledEnv';

import LegacyAnalyticsListener from './LegacyAnalyticsListener';
import ModernAnalyticsListener from './ModernAnalyticsListener';
import { type AnalyticsListenerFunction } from './types';

const ExportedAnalyticsListener: AnalyticsListenerFunction = (props) => {
	const isModernContext =
		isModernContextEnabledEnv || fg('platform.analytics-next-use-modern-context_fqgbx');

	return isModernContext ? (
		<ModernAnalyticsListener {...props} />
	) : (
		<LegacyAnalyticsListener {...props} />
	);
};

export default ExportedAnalyticsListener;
