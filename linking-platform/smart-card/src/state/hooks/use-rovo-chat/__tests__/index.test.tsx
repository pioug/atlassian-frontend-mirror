import { act, renderHook } from '@testing-library/react';

import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import type { ChatNewPayload } from '@atlaskit/rovo-triggers/types';

import useRovoChat from '../index';

jest.mock('@atlaskit/rovo-triggers/post-message-to-pubsub');

const useRovoPostMessageToPubsubMock = useRovoPostMessageToPubsub as jest.MockedFunction<
	typeof useRovoPostMessageToPubsub
>;

describe('useRovoChat', () => {
	describe('sendPromptMessage', () => {
		const publishWithPostMessageMock = jest.fn();

		beforeEach(() => {
			useRovoPostMessageToPubsubMock.mockReturnValue({
				publishWithPostMessage: publishWithPostMessageMock,
				isWaitingForAck: false,
			});
		});

		it.each<[string, ChatNewPayload['data']['name'], ChatNewPayload['data']['prompt']]>([
			['string', 'Simple prompt', 'Simple prompt message'],
			[
				'adf',
				'Rich text prompt',
				{
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: "Explain how this link is relevant to the page I'm viewing. ",
								},
								{ type: 'inlineCard', attrs: { url: 'link-url' } },
							],
						},
						{
							type: 'bulletList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'paragraph',
											content: [{ type: 'text', text: 'Give me a short summary.' }],
										},
									],
								},
								{
									type: 'listItem',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Compare their goals, assumptions, and recommendations.',
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		])('should send prompt as %s', (_, expectedName, expectedPrompt) => {
			const { result } = renderHook(() => useRovoChat());

			act(() => {
				result.current.sendPromptMessage({ name: expectedName, prompt: expectedPrompt });
			});

			expect(publishWithPostMessageMock).toHaveBeenCalledWith(
				expect.objectContaining({
					targetWindow: expect.any(Object),
					payload: {
						type: 'chat-new',
						source: 'smart-link',
						data: {
							dialogues: [],
							name: expectedName,
							prompt: expectedPrompt,
							agentId: undefined,
						},
						openChat: true,
						openChatMode: 'sidebar',
					},
					onAcknowledgeTimeout: expect.any(Function),
				}),
			);
		});
	});
});
