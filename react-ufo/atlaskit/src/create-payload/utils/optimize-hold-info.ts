import type { InteractionMetrics } from '../../common';
import { optimizeLabelStack, stringifyLabelStackFully } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeHoldInfo(
	holdInfo: InteractionMetrics['holdInfo'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	const holdInfoMap = holdInfo.reduce((result, hold) => {
		const { labelStack, name, start, end, ignoreOnSubmit } = hold;

		if (labelStack && !ignoreOnSubmit && start >= interactionStart) {
			const label = stringifyLabelStackFully([...labelStack, { name }]);
			const startTime = Math.round(start);
			const endTime = Math.round(end);

			const timing = result.get(label) || {
				labelStack: optimizeLabelStack([...labelStack, { name }], reactUFOVersion),
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
