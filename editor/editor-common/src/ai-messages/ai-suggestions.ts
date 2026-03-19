import { defineMessages } from 'react-intl-next';

export const aiSuggestionsMessages: {
    suggestionsToolbarButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; suggestionsToolbarButtonLoadingLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; suggestionsToolbarButtonReadyLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; suggestionsToolbarButtonErrorLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; previewLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; viewLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; titleLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; reviewNote: {
        id: string;
        defaultMessage: string;
        description: string;
    }; applyChangesButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; fetchSuggestionsButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; fetchSuggestionsButtonLoadingLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; originalViewLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; suggestedLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; suggestionsLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; cardExpandButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; cardCollapseButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; cardCloseButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; cardRovoTitle: {
        id: string;
        defaultMessage: string;
        description: string;
    }; cardPrivateLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; cardAcceptButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; cardDiscardButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
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
