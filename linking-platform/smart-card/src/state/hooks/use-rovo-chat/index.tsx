import { useCallback, useMemo } from 'react';

import type { ProductType } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import type { ChatNewPayload } from '@atlaskit/rovo-triggers/types';

import { getIsRovoChatEnabled } from '../../../utils/rovo';
import useRovoConfig from '../use-rovo-config';

import { JIRA_PRODUCTS } from './constants';

const SMART_LINK_TO_ROVO_SOURCE = 'smart-link';

export type SendPromptMessageData = Partial<ChatNewPayload['data']>;

const useRovoChat = (): {
	isRovoChatEnabled: boolean;
	sendPromptMessage: (data: SendPromptMessageData, product?: ProductType) => void;
} => {
	const { rovoOptions: config, product } = useRovoConfig();
	const { publishWithPostMessage } = useRovoPostMessageToPubsub();

	const isRovoChatEnabled = getIsRovoChatEnabled(config);

	const sendPromptMessage = useCallback(
		(data: SendPromptMessageData) => {
			publishWithPostMessage({
				targetWindow: window.parent ?? window,
				payload: {
					type: 'chat-new',
					source: SMART_LINK_TO_ROVO_SOURCE,
					data: {
						dialogues: [],
						...data,
						agentId: undefined,
					},
					openChat: true,
					openChatMode:
						(product &&
							JIRA_PRODUCTS.includes(product) &&
						(fg('platform_sl_3p_auth_rovo_block_jira_kill_switch')) ||
						fg('rovogrowth-640-inline-action-nudge-fg'))
							? 'mini-modal'
							: 'sidebar',
				},
				onAcknowledgeTimeout: () => {
					// NAVX-3599: Add analytics event
				},
			});
		},
		[publishWithPostMessage, product],
	);

	return useMemo(
		() => ({ isRovoChatEnabled, sendPromptMessage }),
		[isRovoChatEnabled, sendPromptMessage],
	);
};

export default useRovoChat;
