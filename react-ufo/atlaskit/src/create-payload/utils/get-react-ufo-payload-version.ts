import type { InteractionType } from '../../interaction-metrics';

export function getReactUFOPayloadVersion(
	interactionType: InteractionType,
	isPostInteractionLog?: boolean,
) {
	if (isPostInteractionLog) {
		return '1.0.1';
	}

	if (interactionType !== 'page_load' && interactionType !== 'transition') {
		return '1.0.1';
	}

	return '2.0.0';
}
