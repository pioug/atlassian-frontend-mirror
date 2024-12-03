import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import isModernContextEnabledEnv from '../../utils/isModernContextEnabledEnv';

import LegacyAnalyticsContext from './LegacyAnalyticsContext';
import ModernAnalyticsContext from './ModernAnalyticsContext';
import { type AnalyticsContextFunction } from './types';

const ExportedAnalyticsContext: AnalyticsContextFunction = (props) => {
	const isModernContext = isModernContextEnabledEnv || fg('analytics-next-use-modern-context_jira');

	return isModernContext ? (
		<ModernAnalyticsContext {...props} />
	) : (
		<LegacyAnalyticsContext {...props} />
	);
};

export default ExportedAnalyticsContext;
