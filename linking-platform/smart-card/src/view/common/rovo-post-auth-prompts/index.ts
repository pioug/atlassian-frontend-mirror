import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { ProductType } from '@atlaskit/linking-common/types';

import { isRovoChatActionVisualizeEnabled } from '../../../utils/is-rovo-chat-action-visualize-enabled';
import { RovoChatPromptKey } from '../rovo-chat-utils';

export type RovoPostAuthPromptKeysOptions = {
	extensionKey?: string;
	/**
	 * Whether the Rovo chat action will be shown for the link. Prompt experiments
	 * (e.g. Visualize) are only evaluated, firing exposure, when this is true.
	 */
	isRovoChatActionShown?: boolean;
	product?: ProductType;
	response?: JsonLd.Response;
};

export const getRovoPostAuthPromptKeys = ({
	extensionKey,
	isRovoChatActionShown = false,
	product,
	response,
}: RovoPostAuthPromptKeysOptions): RovoChatPromptKey[] => {
	const defaultPrompts = [RovoChatPromptKey.KEY_HIGHLIGHTS];

	if (extensionKey === 'github-object-provider' || extensionKey === 'gitlab-object-provider') {
		return [RovoChatPromptKey.EXPLAIN_CODE, ...defaultPrompts];
	}

	if (
		isRovoChatActionShown &&
		isRovoChatActionVisualizeEnabled({ extensionKey, product, response })
	) {
		// Visualize goes first (PM decision). The embed Rovo actions footer hides every prompt after
		// the first below 320px (HIDE_SECONDARY_ACTIONS_WIDTH), so this keeps Visualize visible on
		// narrow embeds whenever exposure fires.
		return [RovoChatPromptKey.VISUALIZE, RovoChatPromptKey.SUMMARIZE_DOCUMENT, ...defaultPrompts];
	}

	return [RovoChatPromptKey.SUMMARIZE_DOCUMENT, ...defaultPrompts];
};
