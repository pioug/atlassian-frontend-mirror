import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { ActionName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import useRovoChat, { type SendPromptMessageData } from '../../../../../state/hooks/use-rovo-chat';
import { getPromptAction, RovoChatPromptKey } from "../../../../common/rovo-chat-utils";
import Action from '../action';
import { type LinkActionProps } from '../types';

const GOOGLE_PROMPTS = [
	RovoChatPromptKey.RECOMMEND_OTHER_SOURCES,
	RovoChatPromptKey.SHOW_OTHER_MENTIONS,
	RovoChatPromptKey.SUGGEST_IMPROVEMENT,
];


const DEFAULT_PROMPTS = GOOGLE_PROMPTS;

type RovoChatActionProps = LinkActionProps & {
	prompts?: RovoChatPromptKey[];
};
const RovoChatAction = ({
	onClick: onClickCallback,
	prompts,
	testId = 'smart-action-rovo-chat-action',
	...props
}: RovoChatActionProps): React.JSX.Element | null => {
	const intl = useIntl();
	const { isRovoChatEnabled, sendPromptMessage } = useRovoChat();
	const context = useFlexibleUiContext();
	const data = context?.actions?.[ActionName.RovoChatAction];

	const resolvedPrompts = useMemo(() => {
		if (prompts) {
			return prompts;
		}
		return DEFAULT_PROMPTS;
	}, [prompts]);
	const invoke = useInvokeClientAction({});

	const onClick = useCallback(
		(promptData: SendPromptMessageData, promptKey: RovoChatPromptKey) => {
			if (promptData && data?.invokeAction) {
				invoke({
					...data?.invokeAction,
					actionFn: async () => sendPromptMessage(promptData),
					prompt: promptKey,
				});

				onClickCallback?.();
			}
		},
		[data?.invokeAction, invoke, onClickCallback, sendPromptMessage],
	);

	const promptActions = useMemo(() => {
		return resolvedPrompts.map((promptKey: RovoChatPromptKey, idx: number) => {
			const {
				icon,
				content,
				tooltipMessage,
				data: promptData,
			} = getPromptAction({
					promptKey,
					intl,
					url: data?.url,
					product: data?.product,
					iconSize: props.iconSize,
					cardAppearance: props.cardAppearance,
			}) || {};

			return promptData ? (
				<Action
					content={content}
					icon={icon}
					key={promptKey}
					onClick={() => onClick(promptData, promptKey)}
					testId={`${testId}-${idx + 1}`}
					tooltipMessage={tooltipMessage}
					{...props}
				/>
			) : null;
		});
	}, [data, intl, onClick, resolvedPrompts, props, testId]);

	return isRovoChatEnabled && data && promptActions?.length > 0 ? <>{promptActions}</> : null;
};

export default RovoChatAction;
