import type { InteractionMetrics } from '../common';
import type { OptimizedLabelStack } from './common/types';

export function optimizeRedirects(
	redirects: InteractionMetrics['redirects'],
	interactionStart: number,
): any {
	let lastRedirectTime = interactionStart;
	const updatedRedirects = redirects
		.sort((a, b) => a.time - b.time)
		.reduce(
			(result, redirect) => {
				const { fromInteractionName, time } = redirect;

				if (lastRedirectTime >= interactionStart) {
					result.push({
						labelStack: [{ n: fromInteractionName }],
						startTime: Math.round(lastRedirectTime),
						endTime: Math.round(time),
					});
				}
				lastRedirectTime = time;

				return result;
			},
			[] as {
				labelStack: OptimizedLabelStack;
				startTime: number;
				endTime: number;
			}[],
		);

	return updatedRedirects;
}
