import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { bindAll } from 'bind-event-listener';
import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { ChatPill } from '../../common/ui/chat-pill';

import { messages } from './messages';

function useWindowLocationChange() {
	const [location, setLocation] = useState(window.location.href);

	const handleLocationChange = () => {
		setLocation(window.location.href);
	};

	useEffect(() => {
		const originalPushState = window.history.pushState;
		const originalReplaceState = window.history.replaceState;

		window.history.pushState = function (...args) {
			originalPushState.apply(this, args);
			handleLocationChange();
		};

		window.history.replaceState = function (...args) {
			originalReplaceState.apply(this, args);
			handleLocationChange();
		};

		const unbind = bindAll(window, [
			{
				type: 'popstate',
				listener: handleLocationChange,
			},
		]);

		return () => {
			unbind();
			window.history.pushState = originalPushState;
			window.history.replaceState = originalReplaceState;
		};
	}, []);

	return location;
}

export enum PageContextType {
	CONFLUENCE_HOME = 'confluence-home',
	CONFLUENCE_PAGE_VIEW = 'confluence-page-view',
	CONFLUENCE_PAGE_EDIT = 'confluence-page-edit',
	JIRA_HOME = 'jira-home',
	JIRA_ISSUE_VIEW = 'jira-issue-view',
	JIRA_ISSUE_LIST = 'jira-issue-list',
	UNKNOWN = 'unknown',
}

const PAGE_TYPE_CONVERSATION_STARTERS: {
	[key in PageContextType]: Array<typeof messages.emptyStateSuggestion1>;
} = {
	[PageContextType.CONFLUENCE_HOME]: [
		messages.confluenceHomeSuggestion1,
		messages.confluenceHomeSuggestion2,
		messages.confluenceHomeSuggestion3,
	],
	[PageContextType.CONFLUENCE_PAGE_EDIT]: [
		messages.confluencePageEditSuggestion1,
		messages.confluencePageEditSuggestion2,
		messages.confluencePageEditSuggestion3,
	],
	[PageContextType.CONFLUENCE_PAGE_VIEW]: [
		messages.confluencePageViewSuggestion1,
		messages.confluencePageViewSuggestion2,
		messages.confluencePageViewSuggestion3,
	],
	[PageContextType.JIRA_HOME]: [
		messages.jiraHomeSuggestion1,
		messages.jiraHomeSuggestion2,
		messages.jiraHomeSuggestion3,
	],
	[PageContextType.JIRA_ISSUE_VIEW]: [
		messages.jiraIssueViewSuggestion1,
		messages.jiraIssueViewSuggestion2,
		messages.jiraIssueViewSuggestion3,
	],
	[PageContextType.JIRA_ISSUE_LIST]: [
		messages.jiraIssueListSuggestion1,
		messages.jiraIssueListSuggestion2,
		messages.jiraIssueListSuggestion3,
	],
	[PageContextType.UNKNOWN]: [
		messages.emptyStateSuggestion1,
		messages.emptyStateSuggestion2,
		messages.emptyStateSuggestion3,
	],
};

function determinePageType(location: string): PageContextType {
	const urlPatterns: [PageContextType, RegExp][] = [
		[PageContextType.CONFLUENCE_HOME, /\/wiki\/home$/],
		[PageContextType.CONFLUENCE_PAGE_EDIT, /\/wiki\/spaces\/[^\/]+\/(?:pages|blog)\/edit-v2\//],
		[PageContextType.CONFLUENCE_PAGE_VIEW, /\/wiki\/spaces\/[^\/]+\/(?:pages|blog)\//],
		[PageContextType.JIRA_ISSUE_VIEW, /\/browse\/[^\/]+$/],
		[PageContextType.JIRA_ISSUE_VIEW, /\/jira\/.+\/projects\/.+\?selectedIssue/],
		[PageContextType.JIRA_ISSUE_LIST, /\/jira\/.+\/projects\//],
		[PageContextType.JIRA_HOME, /\/jira\/dashboards\/last-visited$/],
	];

	for (const [type, pattern] of urlPatterns) {
		if (pattern.test(location)) {
			return type;
		}
	}
	return PageContextType.UNKNOWN;
}

export const usePageContextType = () => {
	const location = useWindowLocationChange();
	const [pageContextType, setPageContextType] = useState<PageContextType>(
		determinePageType(location),
	);

	useEffect(() => {
		setPageContextType(determinePageType(location));
	}, [location]);

	return pageContextType;
};

type GetConversationStartersParams = {
	userDefinedConversationStarters?: string[] | null | undefined;
	isAgentDefault: boolean;
	pageContextType?: PageContextType;
};

type ConversationStarters = {
	userDefinedConversationStarters: string[];
	customAgentConversationStarters: MessageDescriptor[];
	defaultAgentConversationStarters: MessageDescriptor[];
	combinedConversationStarters: Array<string | MessageDescriptor>;
};

export const getConversationStarters = ({
	userDefinedConversationStarters: userDefinedConversationStartersParam,
	isAgentDefault,
	pageContextType = PageContextType.UNKNOWN,
}: GetConversationStartersParams): ConversationStarters => {
	const customAgentConversationStarters = [
		messages.agentEmptyStateSuggestion1,
		messages.agentEmptyStateSuggestion2,
		messages.agentEmptyStateSuggestion3,
	];

	const userDefinedConversationStarters = userDefinedConversationStartersParam ?? [];

	const isPageContextConvoStartersEnabled = fg('rovo_chat_page_context_static_convo_starters');

	const defaultAgentConversationStarters = isPageContextConvoStartersEnabled
		? PAGE_TYPE_CONVERSATION_STARTERS[pageContextType]
		: [
				messages.emptyStateSuggestion1,
				messages.emptyStateSuggestion2,
				messages.emptyStateSuggestion3,
			];

	const getCombinedConversationStarters = () => {
		if (!isAgentDefault && fg('rovo_chat_new_create_agent')) {
			// Return default suggestions + user defined suggestions with a max of 3 suggestions
			return [
				...customAgentConversationStarters.slice(0, 3 - userDefinedConversationStarters.length),
				...userDefinedConversationStarters,
			];
		}

		return defaultAgentConversationStarters;
	};

	return {
		userDefinedConversationStarters,
		customAgentConversationStarters,
		defaultAgentConversationStarters,
		combinedConversationStarters: getCombinedConversationStarters(),
	};
};

export type AgentConversationStartersProps = {
	userDefinedConversationStarters?: GetConversationStartersParams['userDefinedConversationStarters'];
	isAgentDefault: GetConversationStartersParams['isAgentDefault'];
	onConversationStarterClick: (conversationStarter: string) => void;
};

export const AgentConversationStarters = ({
	userDefinedConversationStarters,
	isAgentDefault,
	onConversationStarterClick,
}: AgentConversationStartersProps) => {
	const { formatMessage } = useIntl();
	const pageContextType = usePageContextType();

	const { combinedConversationStarters } = useMemo(
		() =>
			getConversationStarters({ userDefinedConversationStarters, isAgentDefault, pageContextType }),
		[userDefinedConversationStarters, isAgentDefault, pageContextType],
	);

	const onClick = useCallback(
		(message: string) => {
			onConversationStarterClick(message);
		},
		[onConversationStarterClick],
	);

	return (
		<>
			{combinedConversationStarters.map((starter) => {
				const translatedMessage = typeof starter === 'string' ? starter : formatMessage(starter);
				return (
					<ChatPill
						testId="conversation-starter"
						key={translatedMessage}
						onClick={() => onClick(translatedMessage)}
					>
						{translatedMessage}
					</ChatPill>
				);
			})}
		</>
	);
};
