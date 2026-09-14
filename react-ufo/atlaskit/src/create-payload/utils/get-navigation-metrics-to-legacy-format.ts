import type { InteractionType } from '../../common';

import getNavigationMetrics, { type NavigationMetrics } from './get-navigation-metrics';

// Helper function to get navigation metrics in legacy format for backward compatibility
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getNavigationMetricsToLegacyFormat(type: InteractionType):
	| {
			'metrics:navigation'?: undefined;
	  }
	| {
			'metrics:navigation': NavigationMetrics;
	  } {
	const navigationMetrics = getNavigationMetrics(type);

	if (!navigationMetrics) {
		return {};
	}

	return {
		'metrics:navigation': navigationMetrics,
	};
}
