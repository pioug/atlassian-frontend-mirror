import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen } from '@atlassian/testing-library';

import { messages } from './messages';

import { AgentConversationStarters, getConversationStarters } from './index';

describe('AgentConversationStarters', () => {
	const mockProps = {
		userDefinedConversationStarters: [],
		isAgentDefault: false,
		onConversationStarterClick: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	ffTest.both('rovo_agent_empty_state_refresh', '', () => {
		describe('Default Agent', () => {
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
			it('should capture and report a11y violations', async () => {
				const type = 'user-defined';
				const { container } = render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={[
								{ message: 'Starter 1', type },
								{ message: 'Starter 2', type },
								{ message: 'Starter 3', type },
							]}
						/>
					</IntlProvider>,
				);

				await expect(container).toBeAccessible();
			});

			it('shows 0 default and 3 agent suggestions when 3 suggestions are provided', () => {
				const type = 'user-defined';
				render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={[
								{ message: 'Starter 1', type },
								{ message: 'Starter 2', type },
								{ message: 'Starter 3', type },
							]}
						/>
					</IntlProvider>,
				);

				expect(screen.queryAllByRole('button')).toHaveLength(3);

				[
					{ message: 'Starter 1', type },
					{ message: 'Starter 2', type },
					{ message: 'Starter 3', type },
				].forEach((prompt) => {
					const button = screen.queryByRole('button', {
						name: prompt.message,
					});
					expect(button).toBeVisible();
				});
			});

			it('shows 1 default and 2 agent suggestions when 2 suggestions are provided', () => {
				const type = 'user-defined';
				render(
					<IntlProvider locale="en">
						<AgentConversationStarters
							{...mockProps}
							isAgentDefault={false}
							userDefinedConversationStarters={[
								{ message: 'Starter 1', type },
								{ message: 'Starter 2', type },
							]}
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
							userDefinedConversationStarters={[{ message: 'Starter 1', type: 'user-defined' }]}
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

describe('getConversationStarters', () => {
	it('default agent', () => {
		const starters = getConversationStarters({
			isAgentDefault: true,
		});
		const type = 'static';

		expect(starters).toEqual({
			userDefinedConversationStarters: [],
			customAgentConversationStarters: [
				{ message: messages.agentEmptyStateSuggestion1, type },
				{ message: messages.agentEmptyStateSuggestion2, type },
				{ message: messages.agentEmptyStateSuggestion3, type },
			],
			defaultAgentConversationStarters: [
				{ message: messages.emptyStateSuggestion1, type },
				{ message: messages.emptyStateSuggestion2, type },
				{ message: messages.emptyStateSuggestion3, type },
			],
			combinedConversationStarters: [
				{ message: messages.emptyStateSuggestion1, type },
				{ message: messages.emptyStateSuggestion2, type },
				{ message: messages.emptyStateSuggestion3, type },
			],
		});
	});

	it('custom agent with no user defined starters', () => {
		const starters = getConversationStarters({
			isAgentDefault: false,
		});
		const type = 'static';
		expect(starters).toEqual({
			userDefinedConversationStarters: [],
			customAgentConversationStarters: [
				{ message: messages.agentEmptyStateSuggestion1, type },
				{ message: messages.agentEmptyStateSuggestion2, type },
				{ message: messages.agentEmptyStateSuggestion3, type },
			],
			defaultAgentConversationStarters: [
				{ message: messages.emptyStateSuggestion1, type },
				{ message: messages.emptyStateSuggestion2, type },
				{ message: messages.emptyStateSuggestion3, type },
			],
			combinedConversationStarters: [
				{ message: messages.agentEmptyStateSuggestion1, type },
				{ message: messages.agentEmptyStateSuggestion2, type },
				{ message: messages.agentEmptyStateSuggestion3, type },
			],
		});
	});

	it('custom agent with user defined conversation starters', () => {
		const userDefinedType = 'user-defined';
		const staticType = 'static';
		const starters = getConversationStarters({
			isAgentDefault: false,
			userDefinedConversationStarters: [
				{ message: 'Starter 1', type: userDefinedType },
				{ message: 'Starter 2', type: userDefinedType },
				{ message: 'Starter 3', type: userDefinedType },
			],
		});
		expect(starters).toEqual({
			userDefinedConversationStarters: [
				{ message: 'Starter 1', type: userDefinedType },
				{ message: 'Starter 2', type: userDefinedType },
				{ message: 'Starter 3', type: userDefinedType },
			],
			customAgentConversationStarters: [
				{ message: messages.agentEmptyStateSuggestion1, type: staticType },
				{ message: messages.agentEmptyStateSuggestion2, type: staticType },
				{ message: messages.agentEmptyStateSuggestion3, type: staticType },
			],
			defaultAgentConversationStarters: [
				{ message: messages.emptyStateSuggestion1, type: staticType },
				{ message: messages.emptyStateSuggestion2, type: staticType },
				{ message: messages.emptyStateSuggestion3, type: staticType },
			],
			combinedConversationStarters: [
				{ message: 'Starter 1', type: userDefinedType },
				{ message: 'Starter 2', type: userDefinedType },
				{ message: 'Starter 3', type: userDefinedType },
			],
		});
	});
});
