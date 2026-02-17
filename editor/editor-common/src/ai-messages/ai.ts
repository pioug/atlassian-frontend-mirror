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
	askRovoToolbarIconTitle: {
		id: 'fabric.editor.ai.toolbar.askRovo.title',
		defaultMessage: 'Ask Rovo',
		description: 'Title for an option to use Atlassian Intellgience',
	},
	moreRovoOptionsMenuLabel: {
		id: 'fabric.editor.ai.toolbar.moreRovoOptions.label',
		defaultMessage: 'More Rovo options',
		description:
			'Label for the button which opens a menu with more options for using Atlassian Intellgience',
	},
	askRovoAiSplitButtonLabel: {
		id: 'fabric.editor.ai.toolbar.askRovoAiSplitButton.label',
		defaultMessage: 'Ask Rovo AI',
		description: 'Label for the button prompting user to type a query to Rovo.',
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
	askRovoToolbarIconTooltipQuickCommand: {
		id: 'fabric.editor.ai.toolbar.askRovo.tooltip.quickCommand',
		defaultMessage: "Ask Rovo {key}+'",
		description: 'Tooltip text for an option to use Rovo AI with quick command',
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
	summarizeToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.summarize.title',
		defaultMessage: 'Summarize',
		description:
			'Title for an option to use Atlassian Intellgience to summarize the content currently selected by the user',
	},
	translateToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.translate.title',
		defaultMessage: 'Translate',
		description:
			'Title for an option to use Atlassian Intellgience to translate the content currently selected by the user. Opens another menu which allows the user to select the language.',
	},
	translateOptionsIconLabel: {
		id: 'fabric.editor.ai.toolbar.translateOptions.label',
		defaultMessage: 'Translate options',
		description:
			'Label for an icon which opens another menu to allows the user to select the language to use Atlassian Intellgience to translate the content currently selected by the user.',
	},
	spellingAndGrammarToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.spellingAndGrammar.title',
		defaultMessage: 'Fix spelling and grammar',
		description:
			'Title for an option to use Atlassian Intellgience to fix spelling and grammar of the content currently selected by the user',
	},
	makeLongerToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.makeLonger.title',
		defaultMessage: 'Make longer',
		description:
			'Title for an option to use Atlassian Intellgience to make the content currently selected by the user longer',
	},
	makeShorterToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.makeShorter.title',
		defaultMessage: 'Make shorter',
		description:
			'Title for an option to use Atlassian Intellgience to make the content currently selected by the user shorter',
	},
	changeToneToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.changeTone.title',
		defaultMessage: 'Change tone',
		description:
			'Title for an option to use Atlassian Intellgience to change the tone of the content currently selected by the user. Opens another menu which allows the user to select what about the tone they want to change, e.g. More professional',
	},
	changeToneOptionsIconLabel: {
		id: 'fabric.editor.ai.toolbar.changeToneOptions.title',
		defaultMessage: 'Change tone options',
		description:
			'Label for an icon which signals that you can open a menu to see options about how to change the tone of the content currently selected by the user using Atlassian Intelligence.',
	},
	moreProfessionalToneToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.moreProfessionalTone.title',
		defaultMessage: 'More professional',
		description:
			'Title for an option in the Change Tone menu to use Atlassian Intellgience to change the tone of the content currently selected by the user to be more professional.',
	},
	moreCasualToneToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.moreCasualTone.title',
		defaultMessage: 'More casual',
		description:
			'Title for an option in the Change Tone menu to use Atlassian Intellgience to change the tone of the content currently selected by the user to be more casual.',
	},
	moreEmpatheticToneToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.moreEmpatheticTone.title',
		defaultMessage: 'More empathetic',
		description:
			'Title for an option in the Change Tone menu to use Atlassian Intellgience to change the tone of the content currently selected by the user to be more empathetic.',
	},
	adjustLengthToolbarDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.adjustLength.title',
		defaultMessage: 'Adjust length',
		description:
			'Title for an option to use Atlassian Intellgience to adjust the length of the content currently selected by the user or full page',
	},
	DefineDropdownIconTitle: {
		id: 'fabric.editor.ai.toolbar.DefineDropdownIconTitle.title',
		defaultMessage: 'Define',
		description:
			'Title for an option to use Atlassian Intellgience for the Define Button to define the content currently selected by the user',
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
		description:
			'The text is shown as a title for the AI-powered page summary panel in the editor when the user accesses the summarize page feature.',
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
	cmdPaletteUnhandledErrorMessage: {
		id: 'fabric.editor.ai.experience-application.cmdPaletteUnhandledErrorMessage',
		defaultMessage: "We're having issues and can't generate a response right now. Try again later.",
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

	// Telepointer
	aiRovoTelepointer: {
		id: 'fabric.editor.ai.telepointer.rovo',
		defaultMessage: 'Rovo',
		description: 'This is the name which appears in the AI telepointer',
	},
});
