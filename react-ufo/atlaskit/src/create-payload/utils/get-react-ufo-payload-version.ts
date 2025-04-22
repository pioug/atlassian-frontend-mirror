import type { InteractionType } from '../../interaction-metrics';
import { withProfiling } from '../../self-measurements';

export const getReactUFOPayloadVersion = withProfiling(function getReactUFOVersion(
	interactionType: InteractionType,
) {
	if (interactionType !== 'page_load' && interactionType !== 'transition') {
		return '1.0.1';
	}

	return '2.0.0';
});
