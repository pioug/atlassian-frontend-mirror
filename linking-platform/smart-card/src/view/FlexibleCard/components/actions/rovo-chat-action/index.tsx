import React, { useCallback, useMemo } from 'react';

import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';

import useRovoChat, { type SendPromptMessageData } from '../../../../../state/hooks/use-rovo-chat';
import Action from '../action';
import { type LinkActionProps } from '../types';

// Replace this with actual message key, e.g. link-relevancy, link-summary, etc.
export enum RovoChatPromptKey {
	MESSAGE_1 = 'message-1',
	MESSAGE_2 = 'message-2',
}
const DEFAULT_PROMPTS = [RovoChatPromptKey.MESSAGE_1, RovoChatPromptKey.MESSAGE_2];

const getPromptAction = (
	promptKey: RovoChatPromptKey,
):
	| (Pick<React.ComponentProps<typeof Action>, 'content' | 'icon' | 'tooltipMessage'> & {
			data: SendPromptMessageData;
	  })
	| undefined => {
	// NAVX-3581: Replace this with real prompt message
	switch (promptKey) {
		case RovoChatPromptKey.MESSAGE_1:
			return {
				icon: <RovoChatIcon label="" spacing="spacious" />,
				content: 'Action title 1',
				tooltipMessage: 'Action tooltip 1',
				data: {
					name: 'Chat title 1',
					dialogues: [],
					prompt: { version: 1, type: 'doc', content: [] },
				},
			};
		case RovoChatPromptKey.MESSAGE_2:
			return {
				icon: <RovoChatIcon label="" spacing="spacious" />,
				content: 'Action title 2',
				tooltipMessage: 'Action tooltip 2',
				data: {
					name: 'Chat title 2',
					dialogues: [],
					prompt: { version: 1, type: 'doc', content: [] },
				},
			};
	}
};

type RovoChatActionProps = LinkActionProps & {
	prompts?: RovoChatPromptKey[];
};
const RovoChatAction = ({
	onClick: onClickCallback,
	prompts = DEFAULT_PROMPTS,
	testId = 'smart-action-rovo-chat-action',
	...props
}: RovoChatActionProps): React.JSX.Element | null => {
	const { sendPromptMessage } = useRovoChat();

	const onClick = useCallback(
		(promptData: SendPromptMessageData) => {
			if (promptData) {
				sendPromptMessage(promptData);

				// NAVX-3599: Add analytics event, possibly as useInvokeClientAction()

				onClickCallback?.();
			}
		},
		[onClickCallback, sendPromptMessage],
	);

	const promptActions = useMemo(() => {
		return prompts.map((promptKey: RovoChatPromptKey, idx: number) => {
			const { icon, content, tooltipMessage, data: promptData } = getPromptAction(promptKey) || {};

			return promptData ? (
				<Action
					content={content}
					icon={icon}
					key={promptKey}
					onClick={() => onClick(promptData)}
					testId={`${testId}-${idx + 1}`}
					tooltipMessage={tooltipMessage}
					{...props}
				/>
			) : null;
		});
	}, [onClick, prompts, props, testId]);

	return promptActions?.length > 0 ? <>{promptActions}</> : null;
};

export default RovoChatAction;
