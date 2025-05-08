// eslint-disable-next-line no-restricted-imports
import { defineMessages } from 'react-intl-next';

export const aiExperienceApplicationMessages = defineMessages({
	responseTooSimilarMessage: {
		id: 'fabric.editor.ai.experience.responseTooSimilarMessage',
		defaultMessage:
			'Atlassian Intelligence has no suggestions at this time. Feel free to try a different prompt or content.',
		description:
			'Message to indicate to user the response from Atlassian Intelligence response is too similar or the same as their input.',
	},
	generatingAiResponse: {
		id: 'fabric.editor.ai.experience.generatingAiResponse',
		defaultMessage: 'Generating',
		description:
			'Message to indicate to user that Atlassian Intelligence is generating a response to their input.',
	},
	discardMessagePrompt: {
		id: 'fabric.editor.ai.experience.discardMessagePrompt',
		defaultMessage: 'Do you want to discard your prompt?',
		description: 'Message to confirm if the user wants to discard their input.',
	},
	discardMessageResponse: {
		id: 'fabric.editor.ai.experience.discardMessageResponse',
		defaultMessage: 'Do you want to discard your response?',
		description:
			'Message to confirm if the user wants to discard the generated response from Atlassian Intelligence.',
	},
	loadingTitle: {
		id: 'fabric.editor.ai.experience.loadingTitle',
		defaultMessage: 'Generating',
		description:
			'The title string that appears on the "Loading" screen when the user is waiting for Atlassian Intelligence to generate content',
	},
	messageTemplateAnalysingQuery: {
		id: 'fabric.editor.ai.experience.messageTemplateAnalysingQuery',
		defaultMessage: 'Analyzing: Reviewing your question.',
		description:
			'Message to indicate to user that the AI is reading and understanding their question',
	},
	messageTemplateContentSearch: {
		id: 'fabric.editor.ai.experience.messageTemplateContentSearch',
		defaultMessage: 'Searching: One moment while we search for information.',
		description: 'Message to indicate to user that the AI is searching for content',
	},
	messageTemplatePageHydration: {
		id: 'fabric.editor.ai.experience.messageTemplatePageHydration',
		defaultMessage: 'Searching: One moment while we search the page.',
		description: 'Message to indicate to user that the AI is searching a URL for content',
	},
	messageTemplateNextBestTask: {
		id: 'fabric.editor.ai.experience.messageTemplateNextBestTask',
		defaultMessage: 'Searching: One moment while we search Jira.',
		description: 'Message to indicate to user that the AI is searching Jira',
	},
	convoAIBeta: {
		id: 'fabric.editor.ai.screens.preview.convoAIBeta',
		defaultMessage: 'Content generation requests that reference URLs is in beta.',
		description: 'The disclaimer for convo ai beta lozenge',
	},
	useRovoOrganisationKnowledgeRightText: {
		id: 'fabric.editor.ai.experience.labelRight.rovo',
		defaultMessage: 'Rovo',
		description: 'Righthand side text for Atlassian Intelligence general knowledge suggestion',
	},
	useGeneralAiKnowledgeRightText: {
		id: 'fabric.editor.ai.experience.labelRight.atlassianIntelligence',
		defaultMessage: 'Atlassian Intelligence',
		description: 'Righthand side text for Rovo general knowledge suggestion',
	},
	actionsGroupHeading: {
		id: 'fabric.editor.ai.experience.suggestionGroupHeading.actions',
		defaultMessage: 'Actions',
		description:
			'Heading text to indicate that the next set of features are for general AI actions',
	},
	atlassianIntelligenceGroupHeading: {
		id: 'fabric.editor.ai.experience.suggestionGroupHeading.atlassianIntelligence',
		defaultMessage: 'Atlassian intelligence',
		description:
			'Heading text to indicate that the next set of features are for Atlassian intelligence',
	},
	knowledgeSourceGroupHeading: {
		id: 'fabric.editor.ai.experience.suggestionGroupHeading.knowledgeSource',
		defaultMessage: 'Knowledge source',
		description: 'Heading text to indicate that the next set of features are for Knowledge source',
	},
	agentsSuggestionGroupHeading: {
		id: 'fabric.editor.ai.experience.suggestionGroupHeading.agents',
		defaultMessage: 'Agents',
		description: 'Heading text to indicate that the next set of features are for agents',
	},
	rovoAgentsCountSuggestionGroupHeading: {
		id: 'fabric.editor.ai.experience.suggestionGroupHeading.rovoAgentsCount',
		defaultMessage: `Rovo agents ({numberOfAgents})`,
		description: 'Heading text to indicate that the next set of features are for starred agents',
	},
	useRovoAgentsCountSuggestionGroupHeading: {
		id: 'fabric.editor.ai.experience.suggestionGroupHeading.useRovoAgentsCount',
		defaultMessage: `Use a Rovo agent ({numberOfAgents})`,
		description: 'Heading text to indicate that the next set of features are for starred agents',
	},
	rovoAgentsSuggestionGroupHeading: {
		id: 'fabric.editor.ai.experience.suggestionGroupHeading.rovoAgents',
		defaultMessage: 'Rovo agents',
		description: 'Heading text to indicate that the next set of features are for agents',
	},
	useGeneralAiKnowledgeLabel: {
		id: 'fabric.editor.ai.experience.useGeneralAiKnowledgeLabel',
		defaultMessage: 'Use general knowledge',
		description: 'Label for the button to write using general AI knowledge',
	},
	useRovoOrganisationKnowledgeLabel: {
		id: 'fabric.editor.ai.experience.useRovoOrganisationKnowledgeLabel',
		defaultMessage: 'Use knowledge from your organization',
		description: 'Label for the button to ask using Rovo organisation knowledge',
	},
	agentsFooterRightText: {
		id: 'fabric.editor.ai.experience.footerRightText.agents',
		defaultMessage: 'Powered by Rovo',
		description: 'Label text for Rovo footer icon',
	},
	agentsBrowseMore: {
		id: 'fabric.editor.ai.experience.browseMore.agents',
		defaultMessage: 'Browse Agents',
		description: 'Link text to browse more agents',
	},
	showMoreButton: {
		id: 'fabric.editor.ai.experience.showMoreButton',
		defaultMessage: 'Show more',
		description: 'Link text for the Show more button which is shown when hiding extra suggestions',
	},
	noResultsSuggestion: {
		id: 'fabric.editor.ai.experience.noResultsSuggestion',
		defaultMessage: 'No results',
		description: 'Text which displays when a nested set of results has no search results',
	},
	engagementBannerLinksText: {
		id: 'fabric.editor.ai.experience.engagementBannerLinksText',
		defaultMessage: '🚀 You can now paste links 🔗 to Jira and Confluence content in your prompts.',
		description: 'Text for the engagement banner',
	},
});
