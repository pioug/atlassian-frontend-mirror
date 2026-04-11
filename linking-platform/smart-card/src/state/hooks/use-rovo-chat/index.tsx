import { useCallback, useMemo } from 'react';

import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import type { ChatNewPayload } from '@atlaskit/rovo-triggers/types';

import { getIsRovoChatEnabled } from '../../../utils/rovo';
import useRovoConfig from '../use-rovo-config';

const SMART_LINK_TO_ROVO_SOURCE = 'smart-link';

export type SendPromptMessageData = Partial<ChatNewPayload['data']>;

const useRovoChat = (): {
	isRovoChatEnabled: boolean;
	sendPromptMessage: (data: SendPromptMessageData) => void;
} => {
	const config = useRovoConfig();
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
					openChatMode: 'sidebar',
				},
				onAcknowledgeTimeout: () => {
					// NAVX-3599: Add analytics event
				},
			});
		},
		[publishWithPostMessage],
	);

	return useMemo(
		() => ({ isRovoChatEnabled, sendPromptMessage }),
		[isRovoChatEnabled, sendPromptMessage],
	);
};

export default useRovoChat;
