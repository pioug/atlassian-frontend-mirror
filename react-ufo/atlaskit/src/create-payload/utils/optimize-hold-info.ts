import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';
import type { LabelStackRegistry } from '../common/utils/label-stack-registry';
import { optimizeLabelStackWithRegistry } from '../common/utils/optimize-label-stack-with-registry';
import { stringifyLabelStackFully } from '../common/utils/stringify-label-stack-fully';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

const PRELOAD_HOLD_NAME_PREFIX = 'preload:';

export function optimizeHoldInfo(
	holdInfo: InteractionMetrics['holdInfo'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
	registry?: LabelStackRegistry,
): any[] {
	const emitPreloadNames = fg('platform_ufo_preload_hold_adoption');
	const holdInfoMap = holdInfo.reduce((result, hold) => {
		const { labelStack, name, start, end, ignoreOnSubmit } = hold;

		const isPreloadHold = typeof name === 'string' && name.startsWith(PRELOAD_HOLD_NAME_PREFIX);

		if (labelStack && !ignoreOnSubmit && start >= interactionStart) {
			const label = stringifyLabelStackFully([...labelStack, { name }]);
			const startTime = Math.round(start);
			const endTime = Math.round(end);

			const includeName = isPreloadHold && emitPreloadNames;

			const timing = result.get(label) || {
				labelStack: optimizeLabelStackWithRegistry(
					[...labelStack, { name }],
					reactUFOVersion,
					registry,
				),
				...(includeName
					? {
							name,
						}
					: {}),
				startTime,
				endTime,
			};

			if (startTime < timing.startTime) {
				timing.startTime = startTime;
			}
			if (endTime > timing.endTime) {
				timing.endTime = endTime;
			}

			result.set(label, timing);
		}

		return result;
	}, new Map());

	return [...holdInfoMap.values()];
}
