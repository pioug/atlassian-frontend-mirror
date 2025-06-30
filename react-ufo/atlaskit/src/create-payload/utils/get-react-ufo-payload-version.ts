import type { InteractionType } from '../../interaction-metrics';

export const LATEST_REACT_UFO_PAYLOAD_VERSION = '2.0.0';

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

	return LATEST_REACT_UFO_PAYLOAD_VERSION;
}
