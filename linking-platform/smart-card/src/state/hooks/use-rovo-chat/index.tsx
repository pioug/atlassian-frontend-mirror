import { useCallback, useMemo } from 'react';

import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import type { ChatNewPayload } from '@atlaskit/rovo-triggers/types';

const SMART_LINK_TO_ROVO_SOURCE = 'smart-link';

export type SendPromptMessageData = Partial<ChatNewPayload['data']>;

const useRovoChat = () => {
	const { publishWithPostMessage } = useRovoPostMessageToPubsub();

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

	return useMemo(() => ({ sendPromptMessage }), [sendPromptMessage]);
};

export default useRovoChat;
