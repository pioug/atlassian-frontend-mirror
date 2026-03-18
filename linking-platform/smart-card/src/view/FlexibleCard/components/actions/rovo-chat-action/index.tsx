import React, { useCallback, useMemo } from 'react';

import { type IntlShape, useIntl } from 'react-intl-next';

import type { ProductType } from '@atlaskit/linking-common';

import { InternalActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import useRovoChat, { type SendPromptMessageData } from '../../../../../state/hooks/use-rovo-chat';
import AiChapterIcon from '../../../assets/ai-chapter-icon';
import AIEditIcon from '../../../assets/ai-edit-icon';
import AISearchIcon from '../../../assets/ai-search-icon';
import Action from '../action';
import { type LinkActionProps } from '../types';

import htmlToAdf from './html-to-adf';

export enum RovoChatPromptKey {
	RECOMMEND_OTHER_SOURCES = 'recommend-other-sources',
	SHOW_OTHER_MENTIONS = 'show-other-mentions',
	SUGGEST_IMPROVEMENT = 'suggest-improvement',
}
const DEFAULT_PROMPTS = [
	RovoChatPromptKey.RECOMMEND_OTHER_SOURCES,
	RovoChatPromptKey.SHOW_OTHER_MENTIONS,
	RovoChatPromptKey.SUGGEST_IMPROVEMENT,
];

type CurrentContextType = {
	contextLong: string;
	contextShort: string;
};
const getContext = (intl: IntlShape, product?: ProductType): CurrentContextType | undefined => {
	switch (product) {
		case 'CONFLUENCE':
			return {
				contextLong: intl.formatMessage(messages.rovo_prompt_context_confluence_page),
				contextShort: intl.formatMessage(messages.rovo_prompt_context_confluence_page_short),
			};
		case 'JSW':
		case 'JWM':
		case 'JSM':
		case 'JPD':
			return {
				contextLong: intl.formatMessage(messages.rovo_prompt_context_jira_work_item),
				contextShort: intl.formatMessage(messages.rovo_prompt_context_jira_work_item_short),
			};
	}
};

const getPromptAction = (
	promptKey: RovoChatPromptKey,
	intl: IntlShape,
	url: string = '',
	product?: ProductType,
):
	| (Pick<React.ComponentProps<typeof Action>, 'content' | 'icon' | 'tooltipMessage'> & {
			data: SendPromptMessageData;
	  })
	| undefined => {
	const { contextLong, contextShort } = getContext(intl, product) ?? {
		contextLong: intl.formatMessage(messages.rovo_prompt_context_generic),
		contextShort: intl.formatMessage(messages.rovo_prompt_context_generic),
	};

	switch (promptKey) {
		case RovoChatPromptKey.RECOMMEND_OTHER_SOURCES:
			const label_recommend = intl.formatMessage(
				messages.rovo_prompt_button_recommend_other_sources,
			);
			const html_recommend = intl.formatMessage(
				messages.rovo_prompt_message_recommend_other_sources,
				{ context: contextLong, url },
				{ ignoreTag: true },
			);
			return {
				icon: <AIEditIcon />,
				content: label_recommend,
				tooltipMessage: label_recommend,
				data: {
					name: label_recommend,
					dialogues: [],
					prompt: htmlToAdf(html_recommend),
				},
			};
		case RovoChatPromptKey.SHOW_OTHER_MENTIONS:
			const label_other_mentions = intl.formatMessage(
				messages.rovo_prompt_button_show_other_mentions,
			);
			const html_other_mentions = intl.formatMessage(
				messages.rovo_prompt_message_show_other_mentions,
				{ context: contextLong, url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiChapterIcon />,
				content: label_other_mentions,
				tooltipMessage: label_other_mentions,
				data: {
					name: label_other_mentions,
					dialogues: [],
					prompt: htmlToAdf(html_other_mentions),
				},
			};
		case RovoChatPromptKey.SUGGEST_IMPROVEMENT:
			const label_improvement = intl.formatMessage(
				messages.rovo_prompt_button_suggest_improvement,
				{ context: contextShort },
			);
			const html_improvement = intl.formatMessage(
				messages.rovo_prompt_message_suggest_improvement,
				{ context: contextLong, url },
				{ ignoreTag: true },
			);
			return {
				icon: <AISearchIcon />,
				content: label_improvement,
				tooltipMessage: label_improvement,
				data: {
					name: label_improvement,
					dialogues: [],
					prompt: htmlToAdf(html_improvement),
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
	const intl = useIntl();
	const { isRovoChatEnabled, sendPromptMessage } = useRovoChat();
	const context = useFlexibleUiContext();
	const data = context?.actions?.[InternalActionName.RovoChatAction];
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
		return prompts.map((promptKey: RovoChatPromptKey, idx: number) => {
			const {
				icon,
				content,
				tooltipMessage,
				data: promptData,
			} = getPromptAction(promptKey, intl, data?.url, data?.product) || {};

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
	}, [data, intl, onClick, prompts, props, testId]);

	return isRovoChatEnabled && data && promptActions?.length > 0 ? <>{promptActions}</> : null;
};

export default RovoChatAction;
