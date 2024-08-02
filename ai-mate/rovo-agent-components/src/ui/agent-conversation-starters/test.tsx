import React from 'react';

import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { messages } from './messages';

import {
	AgentConversationStarters,
	getConversationStarters,
	PageContextType,
	usePageContextType,
} from './index';

// is_default: false,

function mockPageLocation(url: string) {
	// @ts-expect-error - TS2790 - The operand of a 'delete' operator must be optional.
	delete window.location;
	// @ts-expect-error - TS2740 - Type '{ search: string; }' is missing the following properties from type 'Location': ancestorOrigins, hash, host, hostname, and 8 more.
	window.location = {
		href: url,
	};
}

describe('AgentConversationStarters', () => {
	const mockProps = {
		userDefinedConversationStarters: [],
		isAgentDefault: false,
		onConversationStarterClick: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Default Agent', () => {
		ffTest.on(
			'rovo_chat_page_context_static_convo_starters',
			'with page-based conversation starters',
			() => {
				it('shows suggestions based on page type', () => {
					// set page type
					mockPageLocation('http://example.atlassian.net/wiki/home');

					render(
						<IntlProvider locale="en">
							<AgentConversationStarters {...mockProps} isAgentDefault />
						</IntlProvider>,
					);

					expect(screen.queryAllByRole('button')).toHaveLength(3);

					[
						messages.confluenceHomeSuggestion1,
						messages.confluenceHomeSuggestion2,
						messages.confluenceHomeSuggestion3,
					].forEach((prompt) => {
						const button = screen.queryByRole('button', {
							name: prompt.defaultMessage,
						});
						expect(button).toBeVisible();
					});
				});

				it('shows default suggestions when page type is unknown', () => {
					// set page
					mockPageLocation('http://example.atlassian.net/unknown');

					render(
						<IntlProvider locale="en">
							<AgentConversationStarters {...mockProps} isAgentDefault />
						</IntlProvider>,
					);

					[
						'Are any of my tickets overdue?',
						'What should I work on next?',
						'Write an update about my week',
					].forEach((prompt) => {
						const button = screen.queryByRole('button', {
							name: prompt,
						});
						expect(button).toBeVisible();
					});
				});
			},
		);

		it('shows default suggestions', () => {
			render(
				<IntlProvider locale="en">
					<AgentConversationStarters {...mockProps} isAgentDefault />
				</IntlProvider>,
			);

			expect(screen.queryAllByRole('button')).toHaveLength(3);

			[
				'Are any of my tickets overdue?',
				'What should I work on next?',
				'Write an update about my week',
			].forEach((prompt) => {
				const button = screen.queryByRole('button', {
					name: prompt,
				});
				expect(button).toBeVisible();
			});
		});
	});

	describe('Custom Agent', () => {
		ffTest.off('rovo_chat_new_create_agent', 'with new create agent off', () => {
			test('shows default suggestions if there are custom agent suggestions', () => {
				render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={['Starter 1', 'Starter 2', 'Starter 3']}
						/>
					</IntlProvider>,
				);

				[
					'Are any of my tickets overdue?',
					'What should I work on next?',
					'Write an update about my week',
				].forEach((prompt) => {
					const button = screen.queryByRole('button', {
						name: prompt,
					});
					expect(button).toBeVisible();
				});
			});
		});

		ffTest.on('rovo_chat_new_create_agent', 'with new create agent on', () => {
			it('shows 0 default and 3 agent suggestions when 3 suggestions are provided', () => {
				render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={['Starter 1', 'Starter 2', 'Starter 3']}
						/>
					</IntlProvider>,
				);

				expect(screen.queryAllByRole('button')).toHaveLength(3);

				['Starter 1', 'Starter 2', 'Starter 3'].forEach((prompt) => {
					const button = screen.queryByRole('button', {
						name: prompt,
					});
					expect(button).toBeVisible();
				});
			});

			it('shows 1 default and 2 agent suggestions when 2 suggestions are provided', () => {
				render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={['Starter 1', 'Starter 2']}
						/>
					</IntlProvider>,
				);

				expect(screen.queryAllByRole('button')).toHaveLength(3);

				['Tell me about yourself', 'Starter 1', 'Starter 2'].forEach((prompt) => {
					const button = screen.queryByRole('button', {
						name: prompt,
					});
					expect(button).toBeVisible();
				});
			});

			it('shows 2 default and 1 agent suggestion when 1 suggestion is provided', () => {
				render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={['Starter 1']}
						/>
					</IntlProvider>,
				);

				expect(screen.queryAllByRole('button')).toHaveLength(3);

				['Tell me about yourself', 'What can you help me with?', 'Starter 1'].forEach((prompt) => {
					const button = screen.getByRole('button', {
						name: prompt,
					});
					expect(button).toBeVisible();
				});
			});

			it('shows 3 default and 0 agent suggestions when no suggestions are provided', () => {
				render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={[]}
						/>
					</IntlProvider>,
				);

				expect(screen.queryAllByRole('button')).toHaveLength(3);

				[
					'Tell me about yourself',
					'What can you help me with?',
					"Summarize what I'm looking at",
				].forEach((prompt) => {
					const button = screen.queryByRole('button', {
						name: prompt,
					});
					expect(button).toBeVisible();
				});
			});
		});
	});
});

describe('usePageContextType', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each([
		{
			url: 'https://example.atlassian.net/jira/software/projects/AAA/boards/1',
			pageContextType: PageContextType.JIRA_ISSUE_LIST,
		},
		{
			url: 'https://example.atlassian.net/jira/software/projects/AAA/boards/1/timeline',
			pageContextType: PageContextType.JIRA_ISSUE_LIST,
		},
		{
			url: 'https://example.atlassian.net/jira/software/projects/AAA/boards/1',
			pageContextType: PageContextType.JIRA_ISSUE_LIST,
		},
		{
			url: 'https://example.atlassian.net/jira/core/projects/JWM/list',
			pageContextType: PageContextType.JIRA_ISSUE_LIST,
		},
		{
			url: 'https://example.atlassian.net/jira/core/projects/JWM/timeline',
			pageContextType: PageContextType.JIRA_ISSUE_LIST,
		},
		{
			url: 'https://example.atlassian.net/jira/core/projects/JWM/issues?jql=project%20%3D%20%22JWM%22%20ORDER%20BY%20created%20DESC',
			pageContextType: PageContextType.JIRA_ISSUE_LIST,
		},
		{
			url: 'https://example.atlassian.net/wiki/home',
			pageContextType: PageContextType.CONFLUENCE_HOME,
		},
		{
			url: 'http://example.atlassian.net/wiki/spaces/AAA/pages/3927750546/Page+Title',
			pageContextType: PageContextType.CONFLUENCE_PAGE_VIEW,
		},
		{
			url: 'http://example.atlassian.net/wiki/spaces/AAA/blog/2024/07/17/3968143057/Blog+Title',
			pageContextType: PageContextType.CONFLUENCE_PAGE_VIEW,
		},
		{
			url: 'https://example.atlassian.net/wiki/spaces/AAA/pages/edit-v2/3972020741',
			pageContextType: PageContextType.CONFLUENCE_PAGE_EDIT,
		},
		{
			url: 'http://example.atlassian.net/wiki/spaces/AAA/blog/edit-v2/3968143057',
			pageContextType: PageContextType.CONFLUENCE_PAGE_EDIT,
		},
		{
			url: 'https://example.atlassian.net/browse/ISS-1',
			pageContextType: PageContextType.JIRA_ISSUE_VIEW,
		},
		{
			url: 'https://example.atlassian.net/jira/software/projects/AAA/boards/1/backlog?selectedIssue=AAA-1',
			pageContextType: PageContextType.JIRA_ISSUE_VIEW,
		},
		{
			url: 'https://example.atlassian.net/jira/software/projects/AAA/boards/1/timeline?selectedIssue=AAA-1',
			pageContextType: PageContextType.JIRA_ISSUE_VIEW,
		},
		{
			url: 'https://example.atlassian.net/jira/software/projects/AAA/boards/1?selectedIssue=AAA-1',
			pageContextType: PageContextType.JIRA_ISSUE_VIEW,
		},
		{
			url: 'https://example.atlassian.net/jira/dashboards/last-visited',
			pageContextType: PageContextType.JIRA_HOME,
		},
		{
			url: 'https://example.atlassian.net/jira/dashboards/last-visited',
			pageContextType: PageContextType.JIRA_HOME,
		},
		{
			url: 'https://example.atlassian.net/wiki/spaces',
			pageContextType: PageContextType.UNKNOWN,
		},
	])('recognizes $url as $pageContextType', ({ url, pageContextType }) => {
		mockPageLocation(url);

		const { result } = renderHook(usePageContextType);

		try {
			expect(result.current).toEqual(pageContextType);
		} catch (error) {
			throw new Error(`Expected ${url} to be identified as ${pageContextType}`);
		}
	});
});

describe('getConversationStarters', () => {
	ffTest.on(
		'rovo_chat_page_context_static_convo_starters',
		'with contextual conversation starters enabled',
		() => {
			it('returns page-specific starters for default agent, pageContextType of Confluence Home', () => {
				const starters = getConversationStarters({
					isAgentDefault: true,
					pageContextType: PageContextType.CONFLUENCE_HOME,
				});

				expect(starters).toEqual({
					userDefinedConversationStarters: [],
					customAgentConversationStarters: [
						messages.agentEmptyStateSuggestion1,
						messages.agentEmptyStateSuggestion2,
						messages.agentEmptyStateSuggestion3,
					],
					defaultAgentConversationStarters: [
						messages.confluenceHomeSuggestion1,
						messages.confluenceHomeSuggestion2,
						messages.confluenceHomeSuggestion3,
					],
					combinedConversationStarters: [
						messages.confluenceHomeSuggestion1,
						messages.confluenceHomeSuggestion2,
						messages.confluenceHomeSuggestion3,
					],
				});
			});

			it('returns page-specific starters for custom agent, pageContextType of Confluence Home', () => {
				const starters = getConversationStarters({
					isAgentDefault: false,
					userDefinedConversationStarters: ['Starter 1', 'Starter 2', 'Starter 3'],
					pageContextType: PageContextType.CONFLUENCE_HOME,
				});
				expect(starters).toEqual({
					userDefinedConversationStarters: ['Starter 1', 'Starter 2', 'Starter 3'],
					customAgentConversationStarters: [
						messages.agentEmptyStateSuggestion1,
						messages.agentEmptyStateSuggestion2,
						messages.agentEmptyStateSuggestion3,
					],
					defaultAgentConversationStarters: [
						messages.confluenceHomeSuggestion1,
						messages.confluenceHomeSuggestion2,
						messages.confluenceHomeSuggestion3,
					],
					combinedConversationStarters: [
						messages.confluenceHomeSuggestion1,
						messages.confluenceHomeSuggestion2,
						messages.confluenceHomeSuggestion3,
					],
				});
			});
		},
	);

	ffTest.off(
		'rovo_chat_page_context_static_convo_starters',
		'with contextual conversation starters disabled',
		() => {
			it('returns generic defaults for default agent, no pageContextType', () => {
				const starters = getConversationStarters({
					isAgentDefault: true,
				});

				expect(starters).toEqual({
					userDefinedConversationStarters: [],
					customAgentConversationStarters: [
						messages.agentEmptyStateSuggestion1,
						messages.agentEmptyStateSuggestion2,
						messages.agentEmptyStateSuggestion3,
					],
					defaultAgentConversationStarters: [
						messages.emptyStateSuggestion1,
						messages.emptyStateSuggestion2,
						messages.emptyStateSuggestion3,
					],
					combinedConversationStarters: [
						messages.emptyStateSuggestion1,
						messages.emptyStateSuggestion2,
						messages.emptyStateSuggestion3,
					],
				});
			});

			it('returns generic defaults for default agent, pageContextType of Confluence Home', () => {
				const starters = getConversationStarters({
					isAgentDefault: true,
					pageContextType: PageContextType.CONFLUENCE_HOME,
				});

				expect(starters).toEqual({
					userDefinedConversationStarters: [],
					customAgentConversationStarters: [
						messages.agentEmptyStateSuggestion1,
						messages.agentEmptyStateSuggestion2,
						messages.agentEmptyStateSuggestion3,
					],
					defaultAgentConversationStarters: [
						messages.emptyStateSuggestion1,
						messages.emptyStateSuggestion2,
						messages.emptyStateSuggestion3,
					],
					combinedConversationStarters: [
						messages.emptyStateSuggestion1,
						messages.emptyStateSuggestion2,
						messages.emptyStateSuggestion3,
					],
				});
			});

			it('returns generic defaults for custom agent, pageContextType of Confluence Home', () => {
				const starters = getConversationStarters({
					isAgentDefault: false,
					userDefinedConversationStarters: ['Starter 1', 'Starter 2', 'Starter 3'],
					pageContextType: PageContextType.CONFLUENCE_HOME,
				});
				expect(starters).toEqual({
					userDefinedConversationStarters: ['Starter 1', 'Starter 2', 'Starter 3'],
					customAgentConversationStarters: [
						messages.agentEmptyStateSuggestion1,
						messages.agentEmptyStateSuggestion2,
						messages.agentEmptyStateSuggestion3,
					],
					defaultAgentConversationStarters: [
						messages.emptyStateSuggestion1,
						messages.emptyStateSuggestion2,
						messages.emptyStateSuggestion3,
					],
					combinedConversationStarters: [
						messages.emptyStateSuggestion1,
						messages.emptyStateSuggestion2,
						messages.emptyStateSuggestion3,
					],
				});
			});
		},
	);
});
