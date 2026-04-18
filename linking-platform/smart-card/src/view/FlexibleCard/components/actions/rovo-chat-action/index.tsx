import React, { useCallback, useMemo } from 'react';

import { type IntlShape, useIntl } from 'react-intl';

import type { ProductType } from '@atlaskit/linking-common';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

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
	SUMMARIZE_LINK = 'summarize-link',
	KEY_HIGHLIGHTS = 'key-highlights',
	ASK_ROVO_ANYTHING = 'ask-rovo-anything',
}
const GOOGLE_PROMPTS = [
	RovoChatPromptKey.RECOMMEND_OTHER_SOURCES,
	RovoChatPromptKey.SHOW_OTHER_MENTIONS,
	RovoChatPromptKey.SUGGEST_IMPROVEMENT,
];

const GENERIC_3P_PROMPTS = [
	// For rovogrowth-640-inline-action-nudge-exp only. Applies to all RovoActions eligible providers, except Google
	RovoChatPromptKey.SUMMARIZE_LINK,
	RovoChatPromptKey.KEY_HIGHLIGHTS,
	RovoChatPromptKey.ASK_ROVO_ANYTHING,
];

const DEFAULT_PROMPTS = GOOGLE_PROMPTS;

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
		case RovoChatPromptKey.SUMMARIZE_LINK:
			const label_summarize = intl.formatMessage(messages.ai_summarize);
			const html_summarize = intl.formatMessage(
				messages.rovo_prompt_message_summarize,
				{ url },
				{ ignoreTag: true },
			);
			return {
				icon: <AIEditIcon />,
				content: label_summarize,
				tooltipMessage: label_summarize,
				data: {
					name: label_summarize,
					dialogues: [],
					prompt: htmlToAdf(html_summarize),
					mode: {
						fastModeEnabled: true,
					},
				},
			};
		case RovoChatPromptKey.KEY_HIGHLIGHTS:
			const label_key_highlights = intl.formatMessage(messages.rovo_prompt_button_key_highlights);
			const html_key_highlights = intl.formatMessage(
				messages.rovo_prompt_message_key_highlights,
				{ url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiChapterIcon />,
				content: label_key_highlights,
				tooltipMessage: label_key_highlights,
				data: {
					name: label_key_highlights,
					dialogues: [],
					prompt: htmlToAdf(html_key_highlights),
					mode: {
						fastModeEnabled: true,
					},
				},
			};
		case RovoChatPromptKey.ASK_ROVO_ANYTHING:
			const label_ask_rovo_anything = intl.formatMessage(
				messages.rovo_prompt_button_ask_rovo_anything,
			);
			const prompt_ask_rovo_anything = intl.formatMessage(
				messages.rovo_prompt_message_ask_rovo_anything,
				{ url },
			);
			return {
				icon: <AISearchIcon />,
				content: label_ask_rovo_anything,
				tooltipMessage: label_ask_rovo_anything,
				data: {
					name: label_ask_rovo_anything,
					dialogues: [],
					prompt: prompt_ask_rovo_anything,
					isPromptPlaceholder: true,
					placeholderType: 'generic',
				},
			};
	}
};

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
	const data = context?.actions?.[InternalActionName.RovoChatAction];

	const resolvedPrompts = useMemo(() => {
		if (prompts) {
			return prompts;
		}
		if (
			expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true) &&
			data?.invokeAction?.extensionKey !== 'google-object-provider'
		) {
			return GENERIC_3P_PROMPTS;
		}
		return DEFAULT_PROMPTS;
	}, [prompts, data?.invokeAction?.extensionKey]);
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
	}, [data, intl, onClick, resolvedPrompts, props, testId]);

	return isRovoChatEnabled && data && promptActions?.length > 0 ? <>{promptActions}</> : null;
};

export default RovoChatAction;
