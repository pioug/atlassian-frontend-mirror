import { type InteractionMetrics } from '../../common';
import { type OptimizedLabelStack } from '../common/types';
import { optimizeLabelStack } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeRequestInfo(
	requestInfo: InteractionMetrics['requestInfo'],
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
): {
	labelStack: OptimizedLabelStack;
	startTime: number;
	endTime: number;
}[] {
	const updatedRequestInfo = requestInfo.reduce(
		(result, reqInfo) => {
			const { labelStack, name, start, end, networkStart, networkComplete } = reqInfo;
			const startTime = networkStart ?? start;
			const endTime = networkComplete ?? end;

			if (labelStack && start >= interactionStart && endTime) {
				result.push({
					labelStack: optimizeLabelStack([...labelStack, { name }], reactUFOVersion),
					startTime: Math.round(startTime),
					endTime: Math.round(endTime),
				});
			}

			return result;
		},
		[] as {
			labelStack: OptimizedLabelStack;
			startTime: number;
			endTime: number;
		}[],
	);

	return updatedRequestInfo;
}
