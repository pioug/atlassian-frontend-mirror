import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';
import { segmentUnmountCache } from '../../interaction-metrics';
import { optimizeLabelStack, stringifyLabelStackFully } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeReactProfilerTimings(
	reactProfilerTimings: InteractionMetrics['reactProfilerTimings'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	const reactProfilerTimingsMap = reactProfilerTimings.reduce(
		(result, { labelStack, startTime, commitTime, actualDuration, type }) => {
			if (labelStack && startTime >= interactionStart) {
				const label = stringifyLabelStackFully(labelStack);
				const start = Math.round(startTime);
				const end = Math.round(commitTime);

				const timing = result.get(label) || {
					labelStack: optimizeLabelStack(labelStack, reactUFOVersion),
					startTime: start,
					endTime: end,
					mountCount: 0,
					rerenderCount: 0,
					renderDuration: 0,
				};

				if (start < timing.startTime) {
					timing.startTime = start;
				}
				if (end > timing.endTime) {
					timing.endTime = end;
				}
				if (type === 'mount') {
					timing.mountCount += 1;
				}
				if (type === 'update') {
					timing.rerenderCount += 1;
				}
				if (segmentUnmountCache.has(label) && fg('platform_ufo_segment_unmount_count')) {
					timing.unmountCount = segmentUnmountCache.get(label) || 0;
					segmentUnmountCache.delete(label);
				}
				timing.renderDuration += Math.round(actualDuration);

				result.set(label, timing);
			}

			return result;
		},
		new Map(),
	);

	return [...reactProfilerTimingsMap.values()];
}
