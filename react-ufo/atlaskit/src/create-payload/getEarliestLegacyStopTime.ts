import type { InteractionMetrics } from '../common';
import type { LabelStack } from '../interaction-context';
import { labelStackStartWith } from './common/utils/label-stack-start-with';

export function getEarliestLegacyStopTime(
	interaction: InteractionMetrics,
	labelStack: LabelStack,
): any {
	let earliestLegacyStopTime: number | null = null;
	interaction.apdex.forEach((a) => {
		if (!a?.stopTime) {
			return;
		}
		if (!labelStackStartWith(a.labelStack ?? [], labelStack)) {
			return;
		}
		if (a.stopTime > interaction.start && (earliestLegacyStopTime ?? a.stopTime) >= a.stopTime) {
			earliestLegacyStopTime = a.stopTime;
		}
	});

	return earliestLegacyStopTime;
}
