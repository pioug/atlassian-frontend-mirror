import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

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

describe('getConversationStarters', () => {
	it('default agent', () => {
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

	it('custom agent with no user defined starters', () => {
		const starters = getConversationStarters({
			isAgentDefault: false,
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
				messages.agentEmptyStateSuggestion1,
				messages.agentEmptyStateSuggestion2,
				messages.agentEmptyStateSuggestion3,
			],
		});
	});

	it('custom agent with user defined conversation starters', () => {
		const starters = getConversationStarters({
			isAgentDefault: false,
			userDefinedConversationStarters: ['Starter 1', 'Starter 2', 'Starter 3'],
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
			combinedConversationStarters: ['Starter 1', 'Starter 2', 'Starter 3'],
		});
	});
});
