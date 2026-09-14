import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import isModernContextEnabledEnv from '../../utils/isModernContextEnabledEnv';

import LegacyAnalyticsListener from './LegacyAnalyticsListener';
import ModernAnalyticsListener from './ModernAnalyticsListener';
import type { AnalyticsListenerFunction } from './types';

const AnalyticsListener: AnalyticsListenerFunction = (props) => {
	// Resolved once at mount, never re-read: Modern and Legacy are different component types, so
	// switching on a later render would unmount the whole subtree beneath this listener.
	const [isModernContext] = React.useState(
		() =>
			isModernContextEnabledEnv ||
			fg('analytics-next-use-legacy-context') === false ||
			fg('adminhub-analytics-next-use-modern-context'),
	);

	return isModernContext ? (
		<ModernAnalyticsListener {...props} />
	) : (
		<LegacyAnalyticsListener {...props} />
	);
};

export default AnalyticsListener;
