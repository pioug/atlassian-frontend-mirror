import { renderHook } from '@testing-library/react-hooks';

import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers';

import { useAgentUrlActions } from '../useAgentActions';

jest.mock('@atlaskit/rovo-triggers');

const useRovoPostMessageToPubsubMock = useRovoPostMessageToPubsub as jest.MockedFunction<
	typeof useRovoPostMessageToPubsub
>;

describe('useAgentUrlActions', () => {
	const publishWithPostMessageMock = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		useRovoPostMessageToPubsubMock.mockReturnValue({
			publishWithPostMessage: publishWithPostMessageMock,
			isWaitingForAck: false,
		});
	});

	describe('onConversationStarter', () => {
		it('should call publishWithPostMessage', () => {
			const { result } = renderHook(() => useAgentUrlActions({ cloudId: 'cloudId' }));
			const { onConversationStarter } = result.current;

			const agentId = 'agentId';
			const prompt = 'This is an example prompt';
			onConversationStarter({ agentId, prompt });

			expect(publishWithPostMessageMock).toHaveBeenCalledWith({
				targetWindow: window,
				payload: {
					type: 'chat-new',
					source: 'AgentProfileCard',
					data: {
						prompt,
						dialogues: [],
						name: 'This is an example prompt',
						agentId,
					},
				},
				onAcknowledgeTimeout: expect.any(Function),
			});
		});
	});

	describe('onOpenChat', () => {
		it('should call publishWithPostMessage', () => {
			const { result } = renderHook(() => useAgentUrlActions({ cloudId: 'cloudId' }));
			const { onOpenChat } = result.current;

			const agentId = 'agentId';
			const agentName = 'agentName';
			onOpenChat(agentId, agentName);

			expect(publishWithPostMessageMock).toHaveBeenCalledWith({
				targetWindow: window,
				payload: {
					type: 'chat-new',
					source: 'AgentProfileCard',
					data: {
						name: `Chat with ${agentName}`,
						dialogues: [],
						agentId,
					},
				},
				onAcknowledgeTimeout: expect.any(Function),
			});
		});
	});
});
