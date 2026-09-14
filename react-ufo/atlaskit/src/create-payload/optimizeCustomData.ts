import type { InteractionMetrics } from '../common';

import { type LabelStackRegistry } from './common/utils/label-stack-registry';
import { optimizeLabelStackWithRegistry } from './common/utils/optimize-label-stack-with-registry';
import { stringifyLabelStackFully } from './common/utils/stringify-label-stack-fully';
import { getReactUFOPayloadVersion } from './utils/get-react-ufo-payload-version';

export function optimizeCustomData(
	interaction: InteractionMetrics,
	registry?: LabelStackRegistry,
): any {
	const { customData, cohortingCustomData, legacyMetrics } = interaction;
	const customDataMap = customData.reduce((result, { labelStack, data }) => {
		const label = stringifyLabelStackFully(labelStack);
		const value = result.get(label)?.data ?? {};

		result.set(label, {
			labelStack: optimizeLabelStackWithRegistry(
				labelStack,
				getReactUFOPayloadVersion(interaction.type),
				registry,
			),
			data: Object.assign(value, data),
		});

		return result;
	}, new Map());

	// Merge cohorting custom data into the same map
	if (cohortingCustomData && cohortingCustomData.size > 0) {
		const label = stringifyLabelStackFully(interaction.labelStack ?? []);
		const value = customDataMap.get(label)?.data ?? {};

		customDataMap.set(label, {
			labelStack: optimizeLabelStackWithRegistry(
				interaction.labelStack ?? [],
				getReactUFOPayloadVersion(interaction.type),
				registry,
			),
			data: Object.assign(value, Object.fromEntries(cohortingCustomData)),
		});
	}

	if (legacyMetrics) {
		const legacyMetricsFiltered = legacyMetrics
			.filter((item) => item.type === 'PAGE_LOAD')
			.reduce((result: any, currentValue) => {
				for (const [key, value] of Object.entries(currentValue.custom || {})) {
					const label = stringifyLabelStackFully([]);
					const labelValue = result.get(label)?.data ?? {};
					result.set(label, {
						labelStack: optimizeLabelStackWithRegistry(
							[],
							getReactUFOPayloadVersion(interaction.type),
							registry,
						),
						data: Object.assign(labelValue, { [key]: value }),
					});
				}
				return result;
			}, new Map());
		return [...customDataMap.values(), ...legacyMetricsFiltered.values()];
	}

	return [...customDataMap.values()];
}
