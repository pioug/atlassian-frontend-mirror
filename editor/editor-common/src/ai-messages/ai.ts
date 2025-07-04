import { defineMessages } from 'react-intl-next';

export const aiMessages = defineMessages({
	// Event hub messages
	eventHubfallbackSuggestedTitle: {
		id: 'fabric.editor.ai.eventHub.fallbackSuggestedTitle',
		defaultMessage: 'Page title',
		description: 'A fallback suggested title for the suggest title prompt',
	},
	eventHubfallbackSuggestedTitlePrefix: {
		id: 'fabric.editor.ai.eventHub.fallbackSuggestedTitlePrefix',
		defaultMessage: 'Page',
		description: 'A fallback suggested title prefix for the suggest title prompt',
	},

	// Toolbar messages
	aiToolbarTitle: {
		id: 'fabric.editor.ai.toolbar.titleText',
		defaultMessage: 'Atlassian Intelligence',
		description: 'Title for Atlassian Intelligence button in editor selection floating toolbar',
	},
	improveWritingToolbarIconTitle: {
		id: 'fabric.editor.ai.toolbar.improveWriting.title',
		defaultMessage: 'Improve writing',
		description:
			'Title for an option to use Atlassian Intellgience to improve the writing of content currently selected by the user',
	},
	improveWritingToolbarIconTooltip: {
		id: 'fabric.editor.ai.toolbar.improveWriting.tooltip',
		defaultMessage: 'Tell Atlassian Intelligence to improve the writing of your selection',
		description:
			'Tooltip text for an option to use Atlassian Intellgience to improve the writing of content currently selected by the user',
	},
	askAIToolbarIconTitle: {
		id: 'fabric.editor.ai.toolbar.askAI.title',
		defaultMessage: 'Ask AI',
		description: 'Title for an option to use Atlassian Intellgience',
	},
	askRovoInputButtonLabel: {
		id: 'fabric.editor.ai.toolbar.askRovoInputButton.label',
		defaultMessage: 'Ask Rovo...',
		description: 'Label for the input button prompting user to type a query to Rovo.',
	},
	askAIToolbarIconTooltip: {
		id: 'fabric.editor.ai.toolbar.tryAI.tooltip',
		defaultMessage: 'Open Atlassian Intelligence',
		description: 'Tooltip text for an option to use Atlassian Intellgience',
	},
	askAIToolbarIconTooltipQuickCommand: {
		id: 'fabric.editor.ai.toolbar.tryAI.tooltip.quickCommand',
		defaultMessage: "Ask AI {key}+'",
		description: 'Tooltip text for an option to use Atlassian Intellgience with quick command',
	},
	tryAIToolbarIconTitle: {
		id: 'fabric.editor.ai.toolbar.tryAI.title',
		defaultMessage: 'Try AI',
		description: 'Title for an option to use Atlassian Intellgience',
	},
	tryAIToolbarIconTooltip: {
		id: 'fabric.editor.ai.toolbar.tryAI.tooltip',
		defaultMessage: 'Open Atlassian Intelligence',
		description: 'Tooltip text for an option to use Atlassian Intellgience',
	},
	simplifiedAIToolbarIconTitle: {
		id: 'fabric.editor.ai.toolbar.simplifiedAI.title',
		defaultMessage: 'AI',
		description: 'Title for Atlassian Intelligence button in editor selection floating toolbar',
	},

	// Prebuilt messages
	atlasGenerateContentConfigItemDescription: {
		id: 'fabric.editor.ai.atlas-prebuilt.atlasGenerateContentConfigItemDescription',
		defaultMessage: `Generates content to be inserted into the update`,
		description: 'Description for AI Generate content prompt',
	},
	atlasSummarizePageConfigItemDescription: {
		id: 'fabric.editor.ai.atlas-prebuilt.atlasSummarizePageConfigItemDescription',
		defaultMessage: `Summarizes the content of the update`,
		description: 'Description for AI Summarise content prompt',
	},
	confluenceChangeToneSelectionToolbarDropdownMenuTitle: {
		id: 'fabric.editor.ai.confluence-prebuilt.confluenceChangeToneSelectionToolbarDropdownMenuTitle',
		defaultMessage: 'Change tone',
		description:
			'Title for Atlassian Intelligence "Change Tone" dropdown in editor selection floating toolbar',
	},
	confluenceRewriteSelectionToolbarDropdownMenuTitle: {
		id: 'fabric.editor.ai.confluence-prebuilt.confluenceRewriteSelectionToolbarDropdownMenuTitle',
		defaultMessage: 'Rewrite',
		description:
			'Title for Atlassian Intelligence "Rewrite" dropdown in editor selection floating toolbar',
	},
	confluenceTranslateSelectionToolbarDropdownMenuTitle: {
		id: 'fabric.editor.ai.confluence-prebuilt.confluenceTranslateSelectionToolbarDropdownMenuTitle',
		defaultMessage: 'Translate',
		description:
			'Title for Atlassian Intelligence "Translate" dropdown in editor selection floating toolbar',
	},

	// AI Panel Action items messages
	actionItemsPageTitle: {
		id: 'fabric.editor.ai.ai-panels.actionItemsPageTitle',
		defaultMessage: `Action items panel (Beta)`,
		description: 'Title for AI action items panel',
	},
	actionItemsPageDescription: {
		id: 'fabric.editor.ai.ai-panels.actionItemsPageDescription',
		defaultMessage: `Use Atlassian Intelligence to find action items and display in a panel`,
		description: 'Description for AI action items panel',
	},

	// AI Panel Summarise page messages
	summarizePageTitle: {
		id: 'fabric.editor.ai.ai-panels.summarizePageTitle',
		defaultMessage: `Page summary panel (Beta)`,
		description: 'Title for AI summary panel',
	},
	summarisePageDescription: {
		id: 'fabric.editor.ai.ai-panels.summarizePageDescription',
		defaultMessage: `Use Atlassian Intelligence to summarize this page and display in a panel`,
		description: 'Description for AI summary panel',
	},

	// Agent messages
	agentsDropdownTitle: {
		id: 'rovo.agents.dropdown.title',
		defaultMessage: 'Agents',
		description: 'Title for the agents dropdown in the editor toolbar',
	},
	agentsViewAgentsLabel: {
		id: 'rovo.agents.dropdown.viewAgents.label',
		defaultMessage: 'View all agents',
		description: 'Label for the dropdown option that allows a user to View all available Agents',
	},

	// Error messages
	unhandledErrorMessage: {
		id: 'fabric.editor.ai.experience-application.unhandledErrorMessage',
		defaultMessage: "We're having trouble. Close the dialog and try again.",
		description: 'Message to users that displays when an unexpected error happens',
	},
	markdownErrorMessage: {
		id: 'fabric.editor.ai.experience-application.error-boundary.markdownErrorMessage',
		defaultMessage: "We're having trouble generating the preview. Close the dialog and try again.",
		description: 'Message to users that displays when an error occurs while generating a preview.',
	},

	// Prompt Builder messages
	promptbuilderAriaLabel: {
		id: 'fabric.editor.ai.commandPalette.promptBuilderForm.generateContent.ariaLabel',
		defaultMessage: 'Ask Atlassian Intelligence',
		description: 'Aria label for prompt builder form',
	},
	promptBuilderFromButton: {
		id: 'fabric.editor.ai.commandPalette.promptBuilderForm.buttons.submit',
		defaultMessage: 'Generate',
		description: 'Label for the Submit button in the command palette',
	},

	// AI Smart button messages
	aiSmartButtonDynamicSurfaceSelectedContent: {
		id: 'fabric.editor.ai.ai-smart-button.context.reference',
		defaultMessage: 'Selected content',
		description:
			'When there is selection, show the selected content in the AI dynamic surface panel',
	},
});
