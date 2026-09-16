import type { StaticAgentConversationStarter } from './index';

export type GetConversationStartersParams = {
	userDefinedConversationStarters?: ConversationStarter[] | null | undefined;
	isAgentDefault: boolean;
};

type ConversationStarters = {
	userDefinedConversationStarters: ConversationStarter[];
	customAgentConversationStarters: StaticAgentConversationStarter[];
	defaultAgentConversationStarters: StaticAgentConversationStarter[];
	combinedConversationStarters: Array<ConversationStarter | StaticAgentConversationStarter>;
};

import type { ConversationStarter } from './index';
import { messages } from './messages';

export const getConversationStarters = ({
	userDefinedConversationStarters: userDefinedConversationStartersParam,
	isAgentDefault,
}: GetConversationStartersParams): ConversationStarters => {
	const type = 'static';
	const customAgentConversationStarters: StaticAgentConversationStarter[] = [
		{ message: messages.agentEmptyStateSuggestion1, type },
		{ message: messages.agentEmptyStateSuggestion2, type },
		{ message: messages.agentEmptyStateSuggestion3, type },
	];

	const userDefinedConversationStarters = userDefinedConversationStartersParam ?? [];

	const defaultAgentConversationStarters: StaticAgentConversationStarter[] = [
		{ message: messages.emptyStateSuggestion1, type },
		{ message: messages.emptyStateSuggestion2, type },
		{ message: messages.emptyStateSuggestion3, type },
	];

	const getCombinedConversationStarters = () => {
		const shouldCombine = !isAgentDefault;

		if (shouldCombine) {
			// Return user defined suggestions + static fallback suggestions with a max of 3 suggestions (user defined taking precendence over fallback)
			return [...userDefinedConversationStarters, ...customAgentConversationStarters].slice(0, 3);
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
