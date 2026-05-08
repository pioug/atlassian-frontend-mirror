import React, { useCallback, useMemo } from 'react';

import { type IntlShape, useIntl } from 'react-intl';

import AiSearchIcon from '@atlaskit/icon-lab/core/ai-search';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import AiGenerativeTextSummaryIcon from '@atlaskit/icon/core/ai-generative-text-summary';
import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import type { ProductType } from '@atlaskit/linking-common';
import { RovoIcon } from '@atlaskit/logo';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { ActionName, CardDisplay } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { isBlockCardRovoActionExperimentEnabled } from '../../../../../state/hooks/use-block-card-rovo-action-experiment';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import useRovoChat, { type SendPromptMessageData } from '../../../../../state/hooks/use-rovo-chat';
import AiChapterIcon from '../../../assets/ai-chapter-icon';
import AIEditIcon from '../../../assets/ai-edit-icon';
import AISearchIcon from '../../../assets/ai-search-icon';
import Action from '../action';
import type { ActionProps } from '../action/types';
import { type LinkActionProps } from '../types';

import htmlToAdf from './html-to-adf';

export enum RovoChatPromptKey {
	RECOMMEND_OTHER_SOURCES = 'recommend-other-sources',
	SHOW_OTHER_MENTIONS = 'show-other-mentions',
	SUGGEST_IMPROVEMENT = 'suggest-improvement',
	SUMMARIZE_LINK = 'summarize-link',
	KEY_HIGHLIGHTS = 'key-highlights',
	ASK_ROVO_ANYTHING = 'ask-rovo-anything',
	IDENTIFY_KEY_POINTS = 'identify-key-points',
	IDENTIFY_KEY_TRENDS = 'identify-key-trends',
	FIND_OPEN_QUESTIONS = 'find-open-questions',
	HIGHLIGHT_RELEVANT_CONTENT = 'highlight-relevant-content',
	SUMMARIZE_THIS_FOR_ME = 'summarize-this-for-me',
	ASK_A_SPECIFIC_QUESTION = 'ask-a-specific-question',
	SHOW_ME_WHATS_RELEVANT = 'show-me-whats-relevant',
}
const GOOGLE_PROMPTS = [
	RovoChatPromptKey.RECOMMEND_OTHER_SOURCES,
	RovoChatPromptKey.SHOW_OTHER_MENTIONS,
	RovoChatPromptKey.SUGGEST_IMPROVEMENT,
];

const GENERIC_3P_PROMPTS = [
	// For rovogrowth-640-inline-action-nudge-exp only
	RovoChatPromptKey.SHOW_ME_WHATS_RELEVANT,
	RovoChatPromptKey.SUMMARIZE_THIS_FOR_ME,
	RovoChatPromptKey.ASK_A_SPECIFIC_QUESTION,
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
	iconSize?: ActionProps['iconSize'],
	cardAppearance?: CardDisplay,
):
	| (Pick<React.ComponentProps<typeof Action>, 'content' | 'icon' | 'tooltipMessage'> & {
			data: SendPromptMessageData;
	  })
	| undefined => {
	const { contextLong, contextShort } = getContext(intl, product) ?? {
		contextLong: intl.formatMessage(messages.rovo_prompt_context_generic),
		contextShort: intl.formatMessage(messages.rovo_prompt_context_generic),
	};

	const isBlockCard3PExperimentEnabled = isBlockCardRovoActionExperimentEnabled(product);

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
				icon:
					cardAppearance === CardDisplay.Block && isBlockCard3PExperimentEnabled ? (
						<AiChatIcon label={label_summarize} size={iconSize} />
					) : (
						<AIEditIcon />
					),
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
		case RovoChatPromptKey.SUMMARIZE_THIS_FOR_ME:
			const label_summarize_this_for_me = intl.formatMessage(
				messages.rovo_prompt_button_summarize_this,
			);
			const html_summarize_this_for_me = intl.formatMessage(
				messages.rovo_prompt_message_summarize,
				{ url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiGenerativeTextSummaryIcon label={label_summarize_this_for_me} />,
				content: label_summarize_this_for_me,
				tooltipMessage: label_summarize_this_for_me,
				data: {
					name: label_summarize_this_for_me,
					dialogues: [],
					prompt: htmlToAdf(html_summarize_this_for_me),
					mode: {
						fastModeEnabled: true,
					},
				},
			};
		case RovoChatPromptKey.HIGHLIGHT_RELEVANT_CONTENT:
			const label_highlight_relevant_content = intl.formatMessage(
				messages.rovo_prompt_button_highlight_relevant_content,
			);
			const html_highlight_relevant_content = intl.formatMessage(
				messages.rovo_prompt_message_highlight_relevant_content,
				{ context: contextLong, url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiChapterIcon />,
				content: label_highlight_relevant_content,
				tooltipMessage: label_highlight_relevant_content,
				data: {
					name: label_highlight_relevant_content,
					dialogues: [],
					prompt: htmlToAdf(html_highlight_relevant_content),
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
				icon:
					cardAppearance === CardDisplay.Block && isBlockCard3PExperimentEnabled ? (
						<RovoIcon label={label_ask_rovo_anything} size={'xxsmall'} shouldUseHexLogo />
					) : (
						<AISearchIcon />
					),
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
		case RovoChatPromptKey.ASK_A_SPECIFIC_QUESTION:
			const label_ask_a_specific_question = intl.formatMessage(
				messages.rovo_prompt_button_ask_a_specific_question,
			);
			const prompt_ask_a_specific_question = intl.formatMessage(
				messages.rovo_prompt_message_ask_rovo_anything,
				{ url },
			);
			return {
				icon: <RovoChatIcon label={label_ask_a_specific_question} />,
				content: label_ask_a_specific_question,
				tooltipMessage: label_ask_a_specific_question,
				data: {
					name: label_ask_a_specific_question,
					dialogues: [],
					prompt: prompt_ask_a_specific_question,
					isPromptPlaceholder: true,
					placeholderType: 'generic',
				},
			};

		case RovoChatPromptKey.KEY_HIGHLIGHTS:
			const label_key_highlights = intl.formatMessage(messages.rovo_prompt_button_key_highlights);
			const html_key_highlights = intl.formatMessage(
				messages.rovo_prompt_message_key_highlights,
				{ context: contextLong, url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiChatIcon label={label_key_highlights} size={iconSize} />,
				content: label_key_highlights,
				tooltipMessage: label_key_highlights,
				data: {
					name: label_key_highlights,
					dialogues: [],
					prompt: htmlToAdf(html_key_highlights),
				},
			};
		case RovoChatPromptKey.SHOW_ME_WHATS_RELEVANT:
			const label_show_me_whats_relevant = intl.formatMessage(
				messages.rovo_prompt_button_show_me_whats_relevant,
			);
			const html_show_me_whats_relevant = intl.formatMessage(
				messages.rovo_prompt_message_highlight_relevant_content,
				{ context: contextLong, url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiSearchIcon label={label_show_me_whats_relevant} />,
				content: label_show_me_whats_relevant,
				tooltipMessage: label_show_me_whats_relevant,
				data: {
					name: label_show_me_whats_relevant,
					dialogues: [],
					prompt: htmlToAdf(html_show_me_whats_relevant),
				},
			};
		case RovoChatPromptKey.IDENTIFY_KEY_TRENDS:
			const label_identify_key_trends = intl.formatMessage(
				messages.rovo_prompt_button_identify_key_trends,
			);
			const html_identify_key_trends = intl.formatMessage(
				messages.rovo_prompt_message_identify_key_trends,
				{ url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiChatIcon label={label_identify_key_trends} size={iconSize} />,
				content: label_identify_key_trends,
				tooltipMessage: label_identify_key_trends,
				data: {
					name: label_identify_key_trends,
					dialogues: [],
					prompt: htmlToAdf(html_identify_key_trends),
				},
			};
		case RovoChatPromptKey.IDENTIFY_KEY_POINTS:
			const label_identify_key_points = intl.formatMessage(
				messages.rovo_prompt_button_identify_key_points,
			);
			const html_identify_key_points = intl.formatMessage(
				messages.rovo_prompt_message_identify_key_points,
				{ url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiChatIcon label={label_identify_key_points} size={iconSize} />,
				content: label_identify_key_points,
				tooltipMessage: label_identify_key_points,
				data: {
					name: label_identify_key_points,
					dialogues: [],
					prompt: htmlToAdf(html_identify_key_points),
				},
			};
		case RovoChatPromptKey.FIND_OPEN_QUESTIONS:
			const label_find_open_questions = intl.formatMessage(
				messages.rovo_prompt_button_find_open_questions,
			);
			const html_find_open_questions = intl.formatMessage(
				messages.rovo_prompt_message_find_open_questions,
				{ url },
				{ ignoreTag: true },
			);
			return {
				icon: <AiChatIcon label={label_find_open_questions} size={iconSize} />,
				content: label_find_open_questions,
				tooltipMessage: label_find_open_questions,
				data: {
					name: label_find_open_questions,
					dialogues: [],
					prompt: htmlToAdf(html_find_open_questions),
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
	const data = context?.actions?.[ActionName.RovoChatAction];

	const resolvedPrompts = useMemo(() => {
		if (prompts) {
			return prompts;
		}
		if (expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true)) {
			return GENERIC_3P_PROMPTS;
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
			} = getPromptAction(
				promptKey,
				intl,
				data?.url,
				data?.product,
				props.iconSize,
				props.cardAppearance,
			) || {};

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
