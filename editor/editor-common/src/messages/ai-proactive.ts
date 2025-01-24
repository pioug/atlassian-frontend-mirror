import { defineMessages } from 'react-intl-next';

export const aiProactiveMessages = defineMessages({
	loadingIconAltText: {
		id: 'fabric.editor.ai.proactive.loading.iconAltText.non-final',
		defaultMessage: 'Loading icon',
		description: 'Icon alt text of the Loading icon',
	},
	findingSuggestionsLabel: {
		id: 'fabric.editor.ai.proactive.findingSuggestionsLabel.non-final',
		defaultMessage: 'Finding suggestions',
		description:
			'The label next to the spinner which indicates recommendations are being requested.',
	},
	findingSuggestionsLoadingLabel: {
		id: 'fabric.editor.ai.proactive.findingSuggestionsLoadingLabel.non-final',
		defaultMessage: 'Finding suggestions',
		description: 'This is the label under the loading spinner when suggestions are being reloaded.',
	},
	findingMoreSuggestionsLoadingLabel: {
		id: 'fabric.editor.ai.proactive.findingMoreSuggestionsLoadingLabel.non-final',
		defaultMessage: 'Finding more suggestions',
		description:
			'The label next to the spinner which indicates more recommendations are being requested.',
	},
	unhandledErrorMessage: {
		id: 'fabric.editor.ai.proactive.error.unhandledErrorMessage',
		defaultMessage: "We're having trouble. Close the dialog and try again.",
		description: 'Message to users that displays when an unexpected error happens',
	},
	markdownErrorMessage: {
		id: 'fabric.editor.ai.proactive.error.markdownErrorMessage',
		defaultMessage: "We're having trouble generating the preview. Close the dialog and try again.",
		description: 'Message to users that displays when an error occurs while generating a preview.',
	},
	recommendationPreviewButtonLabel: {
		id: 'fabric.editor.ai.proactive.recommendation.preview.button.non-final',
		defaultMessage: 'Preview',
		description:
			'The preview button label which allows the user to open the preview modal and see the AI recommendation which will be applied when the user inserts',
	},
	recommendationReplaceButtonLabel: {
		id: 'fabric.editor.ai.proactive.recommendation.replace.button.non-final',
		defaultMessage: 'Replace',
		description:
			'The replace button label, when clicked the AI recommendation which immediately be inserted',
	},
	recommendationDismissButtonLabel: {
		id: 'fabric.editor.ai.proactive.recommendation.dismiss.button.non-final',
		defaultMessage: 'Dismiss',
		description:
			'The dismiss button label,when clicked the AI recommendation will be removed from the list and no longer displayed to the user',
	},
	dismissProactiveRecommendation: {
		id: 'fabric.editor.ai.proactive.preview.dismissProactiveRecommendation.non-final',
		defaultMessage: 'Dismiss',
		description: 'Label for button to dismiss the proactive recommendation',
	},
	insertBelowProactiveRecommendation: {
		id: 'fabric.editor.ai.proactive.preview.insertBelowProactiveRecommendation',
		defaultMessage: 'Insert below',
		description: 'Label for button to insert the proactive recommendation below the user selection',
	},
	replaceProactiveRecommendation: {
		id: 'fabric.editor.ai.proactive.preview.replaceProactiveRecommendation',
		defaultMessage: 'Replace',
		description: 'Label for button to replace selection with proactive recommendation',
	},
	spellingAndGrammarLabel: {
		id: 'fabric.editor.ai.proactive.spellingAndGrammar.label.non-final',
		defaultMessage: 'Spelling and grammar',
		description:
			'The label displayed in the context panel on the spelling and grammar item which display the total spelling and grammar issues found',
	},
	ManageSuggestionTitle: {
		id: 'fabric.editor.ai.proactive.moreMenu.manageSuggestionsTitle.non-final',
		defaultMessage: 'Manage suggestions',
		description:
			'This is the message displayed in the more menu dropdown in the context panel to allow the user to manage suggestions on the suggestions',
	},
	closeButtonLabel: {
		id: 'fabric.editor.ai.proactive.close.label.non-final',
		defaultMessage: 'Close',
		description: 'This is the text applied to the Close icon button label',
	},
	suggestionsTitle: {
		id: 'fabric.editor.ai.proactive.suggestions.title.non-final',
		defaultMessage: 'Suggestions',
		description:
			'The title displayed at the top of the context panel for all recommendations displayed',
	},
	betaLabel: {
		id: 'fabric.editor.ai.proactive.beta.label.non-final',
		defaultMessage: 'BETA',
		description:
			'This is a lozenge displayed in the suggested edits header to signify that this is a beta feature',
	},
	moreMenuLabel: {
		id: 'fabric.editor.ai.proactive.moreMenu.label.non-final',
		defaultMessage: 'more',
		description:
			'This is the message displayed tooltip in the more menu dropdown in the context panel',
	},
	moreMenuManageSuggestions: {
		id: 'fabric.editor.ai.proactive.moreMenu.manageSuggestions.non-final',
		defaultMessage: 'Manage Suggestions',
		description:
			'This is the message displayed in the more menu dropdown in the context panel to allow the user to manage suggestions on the suggestions',
	},
	moreMenuGiveFeedback: {
		id: 'fabric.editor.ai.proactive.moreMenu.giveFeedback.non-final',
		defaultMessage: 'Give feedback',
		description:
			'This is the message displayed in the more menu dropdown in the context panel to allow the user to give feedback on the suggestions',
	},
	moreActionsLabel: {
		id: 'fabric.editor.ai.proactive.moreActions.label.non-final',
		defaultMessage: 'More actions',
		description: 'This is the text applied to the More icon button label',
	},
	reloadSuggestionsStateTitle: {
		id: 'fabric.editor.ai.proactive.reloadSuggestionsState.title.non-final',
		defaultMessage: 'Your content’s looking good',
		description:
			'This is the title of the message displayed in the suggested edits panel when there are new recommendations left after a user has dismissed them all.',
	},
	reloadSuggestionsStateDescription: {
		id: 'fabric.editor.ai.proactive.reloadSuggestionsState.description.non-final',
		defaultMessage: 'Any new suggestions will appear here.',
		description:
			'This is the message displayed in the suggested edits panel when there are no new recommendations left after a user has dismissed them all.',
	},
	reloadSuggestionsButtonLabel: {
		id: 'fabric.editor.ai.proactive.reloadSuggestionsButtonLabel.non-final',
		defaultMessage: 'View past suggestions',
		description:
			'This is the button label to reload suggestions when a user has dismised all recommendations.',
	},
	noSuggestionsStateTitle: {
		id: 'fabric.editor.ai.proactive.noSuggestionsState.title.non-final',
		defaultMessage: 'Suggestions will appear here',
		description:
			'This is the title of the message displayed in the suggested edits panel when there are no recommendations available.',
	},
	noSuggestionsStateDescription: {
		id: 'fabric.editor.ai.proactive.noSuggestionsState.description.non-final',
		defaultMessage:
			'You can also ask AI to improve your page with requests such as <i>Add a table of contents</i> or <i>Create headings</i>.',
		description:
			'This is the message displayed in the suggested edits panel when there are no recommendations available',
	},
	askAIButtonLabel: {
		id: 'fabric.editor.ai.proactive.askAIButtonLabel.non-final',
		defaultMessage: 'Ask AI',
		description: 'This is the button label to open the AI modal.',
	},
	enableSuggestionsStateTitle: {
		id: 'fabric.editor.ai.proactive.enableSuggestionsState.title.non-final',
		defaultMessage: 'You create. We polish.',
		description:
			'This is the title of the message displayed in the suggested edits panel when suggestions are disabled.',
	},
	enableSuggestionsStateDescription: {
		id: 'fabric.editor.ai.proactive.enableSuggestionsState.description.non-final',
		defaultMessage: 'Turn on suggested edits to quickly preview content improvements.',
		description:
			'This is the message displayed in the suggested edits panel when suggestions are disabled.',
	},
	enableSuggestionsButtonLabel: {
		id: 'fabric.editor.ai.proactive.enableSuggestionsButtonLabel.non-final',
		defaultMessage: 'Turn on',
		description:
			'This is the button label in the suggested edits panel when suggestions are disabled.',
	},
});
