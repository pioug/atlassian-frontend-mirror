import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import isModernContextEnabledEnv from '../../utils/isModernContextEnabledEnv';
import LegacyAnalyticsContext from './LegacyAnalyticsContext';
import ModernAnalyticsContext from './ModernAnalyticsContext';
import type { AnalyticsContextFunction } from './types';

const AnalyticsContext: AnalyticsContextFunction = (props) => {
	// Resolved once at mount, never re-read: Modern and Legacy are different component types, so
	// switching on a later render would unmount the whole subtree beneath this provider.
	const [isModernContext] = React.useState(
		() =>
			isModernContextEnabledEnv ||
			fg('analytics-next-use-legacy-context') === false ||
			fg('adminhub-analytics-next-use-modern-context'),
	);

	return isModernContext ? (
		<ModernAnalyticsContext {...props} />
	) : (
		<LegacyAnalyticsContext {...props} />
	);
};

export default AnalyticsContext;
