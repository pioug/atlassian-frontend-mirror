import { type InteractionMetrics } from '../../common';
import { type OptimizedLabelStack } from '../common/types';

export function optimizeCustomTimings(
	customTimings: InteractionMetrics['customTimings'],
	interactionStart: number,
): {
	labelStack: OptimizedLabelStack;
	startTime: number;
	endTime: number;
}[] {
	return customTimings.reduce(
		(result, item) => {
			Object.keys(item.data).forEach((key) => {
				if (item.data[key].startTime >= interactionStart) {
					result.push({
						labelStack: [{ n: key }],
						startTime: Math.round(item.data[key].startTime),
						endTime: Math.round(item.data[key].endTime),
					});
				}
			});

			return result;
		},
		[] as {
			labelStack: OptimizedLabelStack;
			startTime: number;
			endTime: number;
		}[],
	);
}
