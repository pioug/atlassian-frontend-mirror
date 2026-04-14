import type { InteractionMetrics } from '../../common';
import type { OptimizedLabelStack } from '../common/types';
import { optimizeLabelStackWithRegistry } from '../common/utils';
import type { LabelStackRegistry } from '../common/utils/label-stack-registry';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeSpans(
	spans: InteractionMetrics['spans'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
	registry?: LabelStackRegistry,
): {
	labelStack: OptimizedLabelStack;
	startTime: number;
	endTime: number;
	type: string;
}[] {
	const updatedSpans = spans.reduce(
		(result, span) => {
			const { labelStack, type, name, start, end } = span;

			if (labelStack && start >= interactionStart) {
				result.push({
					labelStack: optimizeLabelStackWithRegistry(
						[...labelStack, { name }],
						reactUFOVersion,
						registry,
					),
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
