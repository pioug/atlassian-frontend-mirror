import React, { useCallback, useMemo } from 'react';

import { type IntlShape, useIntl } from 'react-intl-next';

import type { ProductType } from '@atlaskit/linking-common';

import { InternalActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useRovoChat, { type SendPromptMessageData } from '../../../../../state/hooks/use-rovo-chat';
import AiChapterIcon from '../../../assets/ai-chapter-icon';
import AIEditIcon from '../../../assets/ai-edit-icon';
import AISearchIcon from '../../../assets/ai-search-icon';
import Action from '../action';
import { type LinkActionProps } from '../types';

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
	contextLongPlural: string;
	contextShort: string;
};
const getContext = (intl: IntlShape, product?: ProductType): CurrentContextType | undefined => {
	switch (product) {
		case 'CONFLUENCE':
			return {
				contextLong: intl.formatMessage(messages.rovo_prompt_context_confluence_page),
				contextLongPlural: intl.formatMessage(messages.rovo_prompt_context_confluence_page_plural),
				contextShort: intl.formatMessage(messages.rovo_prompt_context_confluence_page_short),
			};
		case 'JSW':
		case 'JWM':
		case 'JSM':
		case 'JPD':
			return {
				contextLong: intl.formatMessage(messages.rovo_prompt_context_jira_work_item),
				contextLongPlural: intl.formatMessage(messages.rovo_prompt_context_jira_work_item_plural),
				contextShort: intl.formatMessage(messages.rovo_prompt_context_jira_work_item_short),
			};
	}
};

const getPromptAction = (
	promptKey: RovoChatPromptKey,
	intl: IntlShape,
	url?: string,
	product?: ProductType,
):
	| (Pick<React.ComponentProps<typeof Action>, 'content' | 'icon' | 'tooltipMessage'> & {
			data: SendPromptMessageData;
	  })
	| undefined => {
	const { contextLong, contextLongPlural, contextShort } = getContext(intl, product) ?? {
		contextLong: intl.formatMessage(messages.rovo_prompt_context_generic),
		contextLongPlural: intl.formatMessage(messages.rovo_prompt_context_generic_plural),
		contextShort: intl.formatMessage(messages.rovo_prompt_context_generic),
	};

	switch (promptKey) {
		case RovoChatPromptKey.RECOMMEND_OTHER_SOURCES:
			const label_recommend = intl.formatMessage(
				messages.rovo_prompt_button_recommend_other_sources,
			);
			return {
				icon: <AIEditIcon />,
				content: label_recommend,
				tooltipMessage: label_recommend,
				data: {
					name: label_recommend,
					dialogues: [],
					// NAVX-3581: To be translated and converted to ADF
					prompt: `From this ${url} and the ${contextLong} I’m viewing now as context:
- Search across all sources I can access for items that discuss similar concepts, themes, or problems, or that reference similar or closely related sources (including links to the same or related pages, issues, or docs).
- Return the results as a list or table with columns: Item, Type, Short summary, and Why it’s similar.
- For each result, give a one‑sentence Short summary of what the item is about.
- In Why it’s similar, briefly explain (in a phrase or short sentence) what makes it related to this Smart Link and/or the item I’m viewing (for example: same project, similar decision, shared requirements, overlapping stakeholders, similar metrics, or referencing related docs).
- Order the list from most to least relevant based on Rovo’s assessment of semantic similarity to both the Smart Link target and the current item.  Prioritize items that I do not own or have not contributed to.
- If there are more than 5 results, show the 5 most relevant and state how many additional items you found.`,
				},
			};
		case RovoChatPromptKey.SHOW_OTHER_MENTIONS:
			const label_other_mentions = intl.formatMessage(
				messages.rovo_prompt_button_show_other_mentions,
			);
			return {
				icon: <AiChapterIcon />,
				content: label_other_mentions,
				tooltipMessage: label_other_mentions,
				data: {
					name: label_other_mentions,
					dialogues: [],
					// NAVX-3581: To be translated and converted to ADF
					prompt: `From this ${url} and the ${contextLong} I’m viewing now:
- Search across all ${contextLongPlural} I can access for other items that contain this exact Smart Link (same underlying URL/resource).
- List all matching items in a table with columns: Item, Type, Short summary, How this item uses the link, and Relevance to current item.
- For Short summary, give a one‑sentence description of what the page/issue is about.
- For How this item uses the link, briefly explain the role this link plays there (e.g., decision doc, background context, implementation details, status update).
- For Relevance to current item, compare each item to the page/issue I’m viewing now and label it High, Medium, or Low relevance, with a short reason (a phrase or single clause).
- If there are more than 15 matches, show the 15 most relevant and tell me how many additional matches exist.`,
				},
			};
		case RovoChatPromptKey.SUGGEST_IMPROVEMENT:
			const label_improvement = intl.formatMessage(
				messages.rovo_prompt_button_suggest_improvement,
				{ context: contextShort },
			);
			return {
				icon: <AISearchIcon />,
				content: label_improvement,
				tooltipMessage: label_improvement,
				data: {
					name: label_improvement,
					dialogues: [],
					// NAVX-3581: To be translated and converted to ADF
					prompt: `Using the ${contextLong} I’m viewing now, plus all files and links referenced in it (including this ${url}):
- Identify unclear reasoning, missing context, or contradictions between the item and its linked files.
- Call out any places where assumptions are not backed up by data or prior docs.
- Stay concise: summarize your findings in no more than three short paragraphs of content listed as bullets of no more than a couple of sentences long focused only on the two points above.
- After presenting that summary, ask me explicitly if I want you to go deeper. Only if I say yes, then:
- Suggest concrete rewrites (bullets or short paragraphs) to make the argument clearer, more concise, and better aligned with the supporting files.
- Propose 3–5 follow‑up edits or additions that would make this item and its linked docs “share‑ready” for stakeholders.`,
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
					onClick={() => onClick(promptData)}
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
