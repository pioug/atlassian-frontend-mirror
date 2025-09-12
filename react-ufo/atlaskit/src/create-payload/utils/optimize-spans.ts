import type { InteractionMetrics } from '../../common';
import type { OptimizedLabelStack } from '../common/types';
import { optimizeLabelStack } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeSpans(
	spans: InteractionMetrics['spans'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	const updatedSpans = spans.reduce(
		(result, span) => {
			const { labelStack, type, name, start, end } = span;

			if (labelStack && start >= interactionStart) {
				result.push({
					labelStack: optimizeLabelStack([...labelStack, { name }], reactUFOVersion),
					startTime: Math.round(start),
					endTime: Math.round(end),
					type,
				});
			}

			return result;
		},
		[] as {
			labelStack: OptimizedLabelStack;
			startTime: number;
			endTime: number;
			type: string;
		}[],
	);

	return updatedSpans;
}
