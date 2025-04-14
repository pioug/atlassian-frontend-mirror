import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionType } from '../interaction-metrics';
import { withProfiling } from '../self-measurements';

export const getReactUFOVersion = withProfiling(function getReactUFOVersion(
	interactionType: InteractionType,
) {
	if (interactionType !== 'page_load' && interactionType !== 'transition') {
		return '1.0.1';
	}

	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (!fg('enable-react-ufo-payload-segment-compressed')) {
		return '1.0.1';
	}

	return '2.0.0';
});
