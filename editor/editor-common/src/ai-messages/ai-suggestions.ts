import { defineMessages } from 'react-intl-next';

export const aiSuggestionsMessages: {
	applyChangesButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cardAcceptButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cardCloseButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cardCollapseButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cardDiscardButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cardExpandButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cardPrivateLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cardRovoTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fetchGenerateFromAdf: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fetchGenerateFromDocument: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fetchSuggestionsButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fetchSuggestionsButtonLoadingLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	originalViewLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	previewLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	reviewNote: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	suggestedLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	suggestionsLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	suggestionsToolbarButtonErrorLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	suggestionsToolbarButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	suggestionsToolbarButtonLoadingLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	suggestionsToolbarButtonReadyLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	titleLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	viewLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	suggestionsToolbarButtonLabel: {
		id: 'fabric.editor.ai.suggestions.toolbarButton.label.non-final',
		defaultMessage: 'Suggestions',
		description: 'Label for the suggestions toolbar button',
	},
	suggestionsToolbarButtonLoadingLabel: {
		id: 'fabric.editor.ai.suggestions.toolbarButton.loadingLabel.non-final',
		defaultMessage: 'Loading',
		description: 'Label for the suggestions toolbar button when loading',
	},
	suggestionsToolbarButtonReadyLabel: {
		id: 'fabric.editor.ai.suggestions.toolbarButton.readyLabel.non-final',
		defaultMessage: 'View',
		description: 'Label for the suggestions toolbar button when ready',
	},
	suggestionsToolbarButtonErrorLabel: {
		id: 'fabric.editor.ai.suggestions.toolbarButton.errorLabel.non-final',
		defaultMessage: 'Retry',
		description: 'Label for the suggestions toolbar button when error',
	},
	previewLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.previewLabel.non-final',
		defaultMessage: 'Preview',
		description: 'The section title displayed for the AI suggestions staging area',
	},
	viewLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.viewLabel.non-final',
		defaultMessage: 'View',
		description:
			'The section title displayed for the view switcher in the AI suggestions staging area',
	},
	titleLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.titleLabel.non-final',
		defaultMessage: 'Title',
		description: 'The section title displayed for the title in the AI suggestions staging area',
	},
	reviewNote: {
		id: 'fabric.editor.ai.suggestions.stagingArea.reviewNote.non-final',
		defaultMessage: 'Review • Only visible to you',
		description: 'A note displayed within the title',
	},
	applyChangesButtonLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.applyChangesButtonLabel.non-final',
		defaultMessage: 'Apply changes',
		description: 'Label for the apply changes button in the AI suggestions staging area',
	},
	fetchSuggestionsButtonLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.fetchSuggestionsButtonLabel.non-final',
		defaultMessage: 'Fetch suggestions',
		description: 'Label for the fetch suggestions button in the AI suggestions staging area',
	},
	fetchSuggestionsButtonLoadingLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.fetchSuggestionsButtonLoadingLabel.non-final',
		defaultMessage: 'Loading…',
		description: 'Label for the fetch suggestions button when loading',
	},
	fetchGenerateFromDocument: {
		id: 'fabric.editor.ai.suggestions.quickInsert.generateFromDocument.non-final',
		defaultMessage: 'Suggested edits (generate)',
		description: 'Quick insert: fetch AI suggestions by generating from the current document (ADF)',
	},
	fetchGenerateFromAdf: {
		id: 'fabric.editor.ai.suggestions.quickInsert.generateFromAdf.non-final',
		defaultMessage: 'Suggested edits (generate from ADF)',
		description:
			'Quick insert: fetch AI suggestions by generating from document, same as page toolbar action',
	},
	originalViewLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.originalViewLabel.non-final',
		defaultMessage: 'Original • View only',
		description: 'Label for the original view in the AI suggestions staging area',
	},
	suggestedLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.suggestedLabel.non-final',
		defaultMessage: 'Suggested',
		description: 'Suggestion text displayed under the original view title',
	},
	suggestionsLabel: {
		id: 'fabric.editor.ai.suggestions.stagingArea.suggestionsLabel.non-final',
		defaultMessage: 'Suggestions',
		description: 'Label for the suggestions section in the AI suggestions staging area',
	},
	cardCloseButtonLabel: {
		id: 'fabric.editor.ai.suggestions.card.closeButtonLabel.non-final',
		defaultMessage: 'Close',
		description: 'Label for the close button on the AI suggestions card',
	},
	cardExpandButtonLabel: {
		id: 'fabric.editor.ai.suggestions.card.expandButtonLabel.non-final',
		defaultMessage: 'Expand',
		description: 'Label for the expand button on the AI suggestions card',
	},
	cardCollapseButtonLabel: {
		id: 'fabric.editor.ai.suggestions.card.collapseButtonLabel.non-final',
		defaultMessage: 'Collapse',
		description: 'Label for the collapse button on the AI suggestions card',
	},
	cardRovoTitle: {
		id: 'fabric.editor.ai.suggestions.card.rovoTitle.non-final',
		defaultMessage: 'Rovo',
		description: 'Title for Rovo branding on the AI suggestions card',
	},
	cardPrivateLabel: {
		id: 'fabric.editor.ai.suggestions.card.privateLabel.non-final',
		defaultMessage: 'Private',
		description: 'Label for the private/lock indicator on the AI suggestions card',
	},
	cardAcceptButtonLabel: {
		id: 'fabric.editor.ai.suggestions.card.acceptButtonLabel.non-final',
		defaultMessage: 'Accept',
		description: 'Label for the accept button on the AI suggestions card',
	},
	cardDiscardButtonLabel: {
		id: 'fabric.editor.ai.suggestions.card.discardButtonLabel.non-final',
		defaultMessage: 'Discard',
		description: 'Label for the discard button on the AI suggestions card',
	},
});
