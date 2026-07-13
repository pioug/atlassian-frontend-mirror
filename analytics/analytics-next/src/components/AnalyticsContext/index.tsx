import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import isModernContextEnabledEnv from '../../utils/isModernContextEnabledEnv';

import LegacyAnalyticsContext from './LegacyAnalyticsContext';
import ModernAnalyticsContext from './ModernAnalyticsContext';
import type { AnalyticsContextFunction } from './types';

const AnalyticsContext: AnalyticsContextFunction = (props) => {
	const computeIsModernContext = () => isModernContextEnabledEnv;
	// Gated by analytics-next-lock-context-type: capture the value once at mount so a late gate flip can't swap the component type and remount the subtree. While locked the gate is not re-read on later renders.
	const [lockedIsModernContext] = React.useState(computeIsModernContext);
	const isModernContext = fg('analytics-next-lock-context-type')
		? lockedIsModernContext
		: computeIsModernContext();

	return isModernContext ? (
		<ModernAnalyticsContext {...props} />
	) : (
		<LegacyAnalyticsContext {...props} />
	);
};

export default AnalyticsContext;
