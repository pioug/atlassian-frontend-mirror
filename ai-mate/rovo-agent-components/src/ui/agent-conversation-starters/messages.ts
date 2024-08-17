import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	emptyStateSuggestion1: {
		id: 'ai-mate.chat-history.empty-state.suggestion1',
		defaultMessage: 'Are any of my tickets overdue?',
		description: 'The first suggestion displayed in the empty state of the chat history',
	},
	emptyStateSuggestion2: {
		id: 'ai-mate.chat-history.empty-state.suggestion2',
		defaultMessage: 'What should I work on next?',
		description: 'The second suggestion displayed in the empty state of the chat history',
	},
	emptyStateSuggestion3: {
		id: 'ai-mate.chat-history.empty-state.suggestion3',
		defaultMessage: 'Write an update about my week',
		description: 'The third suggestion displayed in the empty state of the chat history',
	},
	agentEmptyStateSuggestion1: {
		id: 'ai-mate.chat-history.empty-state.agent-suggestion1',
		defaultMessage: 'Tell me about yourself',
		description: 'The first suggestion displayed in the empty state when an agent is selected',
	},
	agentEmptyStateSuggestion2: {
		id: 'ai-mate.chat-history.empty-state.agent-suggestion2',
		defaultMessage: 'What can you help me with?',
		description: 'The second suggestion displayed in the empty state when an agent is selected',
	},
	agentEmptyStateSuggestion3: {
		id: 'ai-mate.chat-history.empty-state.agent-suggestion3',
		defaultMessage: "Summarize what I'm looking at",
		description: 'The third suggestion displayed in the empty state when an agent is selected',
	},
});
