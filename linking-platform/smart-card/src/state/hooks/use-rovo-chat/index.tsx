import { useCallback, useMemo } from 'react';

import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import type { ChatNewPayload } from '@atlaskit/rovo-triggers/types';

const SMART_LINK_TO_ROVO_SOURCE = 'smart-link';

const useRovoChat = () => {
	const { publishWithPostMessage } = useRovoPostMessageToPubsub();

	const sendPromptMessage = useCallback(
		(data: Partial<ChatNewPayload['data']>) => {
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
