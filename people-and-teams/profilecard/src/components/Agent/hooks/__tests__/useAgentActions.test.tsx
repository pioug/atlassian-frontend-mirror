import { renderHook } from '@testing-library/react-hooks';

import { getATLContextUrl } from '@atlaskit/atlassian-context';
import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useAgentUrlActions } from '../useAgentActions';

jest.mock('@atlaskit/rovo-triggers');

const useRovoPostMessageToPubsubMock = useRovoPostMessageToPubsub as jest.MockedFunction<
	typeof useRovoPostMessageToPubsub
>;

describe('useAgentUrlActions', () => {
	const publishWithPostMessageMock = jest.fn();
	let windowOpenSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		useRovoPostMessageToPubsubMock.mockReturnValue({
			publishWithPostMessage: publishWithPostMessageMock,
			isWaitingForAck: false,
		});
		windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
	});

	describe('onConversationStarter', () => {
		ffTest.off('rovo_profile_card_open_chat_sidebar', 'without postMessageToPubsub', () => {
			it('should open chat prefilled with prompt in new tab', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId: 'cloudId' }));
				const { onConversationStarter } = result.current;

				const agentId = 'agentId';
				const prompt = 'prompt';
				const url = `${getATLContextUrl('home')}/chat?cloudId=cloudId&rovoChatCloudId=cloudId&rovoChatAgentId=agentId&rovoChatPrompt=prompt&rovoChatPathway=chat`;
				onConversationStarter({ agentId, prompt });

				expect(windowOpenSpy).toHaveBeenCalledWith(url, '_blank', 'noopener, noreferrer');
			});
		});

		ffTest.on('rovo_profile_card_open_chat_sidebar', 'with postMessageToPubsub', () => {
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
	});

	describe('onOpenChat', () => {
		ffTest.off('rovo_profile_card_open_chat_sidebar', 'without postMessageToPubsub', () => {
			test('should open chat in new tab', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId: 'cloudId' }));
				const { onOpenChat } = result.current;

				const agentId = 'agentId';
				const agentName = 'agentName';
				const url = `${getATLContextUrl('home')}/chat?cloudId=cloudId&rovoChatCloudId=cloudId&rovoChatAgentId=agentId`;
				onOpenChat(agentId, agentName);

				expect(windowOpenSpy).toHaveBeenCalledWith(url, '_blank', 'noopener, noreferrer');
			});
		});

		ffTest.on('rovo_profile_card_open_chat_sidebar', 'with postMessageToPubsub', () => {
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
});
