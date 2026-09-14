import type { InteractionMetrics } from '../common';
import { getConfig, getUfoNameOverrides } from '../config';

import { createInteractionMetricsPayload } from './createInteractionMetricsPayload';
import type { InteractionMetricsPayloadResult } from './InteractionMetricsPayloadResult';

function getUfoNameOverride(interaction: InteractionMetrics): string {
	const { ufoName, apdex } = interaction;
	try {
		const ufoNameOverrides = getUfoNameOverrides();
		if (ufoNameOverrides != null) {
			const metricKey = apdex.length > 0 ? apdex[0].key : '';
			if (ufoNameOverrides[ufoName][metricKey]) {
				return ufoNameOverrides[ufoName][metricKey];
			}
		}
		return ufoName;
	} catch {
		return ufoName;
	}
}

export async function createPayloads(
	interactionId: string,
	interaction: InteractionMetrics,
): Promise<InteractionMetricsPayloadResult[]> {
	const ufoNameOverride = getUfoNameOverride(interaction);
	const modifiedInteraction = { ...interaction, ufoName: ufoNameOverride };

	const config = getConfig();
	if (config?.disabledUfoNames && config?.disabledUfoNames.includes(ufoNameOverride)) {
		return [];
	}

	const interactionMetricsPayload = await createInteractionMetricsPayload(
		modifiedInteraction,
		interactionId,
	);

	return [interactionMetricsPayload];
}
