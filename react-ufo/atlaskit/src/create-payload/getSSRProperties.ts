import type { InteractionType } from '../common';
import * as ssr from '../ssr';

import getSSRSuccessUtil from './utils/get-ssr-success';
import getSSRSuccessBreakdownUtil from './utils/get-ssr-success-breakdown';

function getSSRPhaseSuccess(type: InteractionType) {
	return type === 'page_load' ? ssr.getSSRPhaseSuccess() : undefined;
}

function getSSRFeatureFlags(type: InteractionType) {
	return type === 'page_load' ? ssr.getSSRFeatureFlags() : undefined;
}

export function getSSRProperties(type: InteractionType): any {
	const ssrPhases = getSSRPhaseSuccess(type);
	const ssrSuccessBreakdown = getSSRSuccessBreakdownUtil();

	return {
		'ssr:success': ssrPhases?.done != null ? ssrPhases.done : getSSRSuccessUtil(type),
		'ssr:featureFlags': getSSRFeatureFlags(type),
		...(ssrSuccessBreakdown !== undefined
			? { 'ssr:success:breakdown': ssrSuccessBreakdown }
			: null),
		...(ssrPhases?.earlyFlush != null
			? {
					'ssr:earlyflush:success': ssrPhases.earlyFlush,
				}
			: null),
		...(ssrPhases?.prefetch != null
			? {
					'ssr:prefetch:success': ssrPhases.prefetch,
				}
			: null),
	};
}
