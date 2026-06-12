import { defineMessages } from 'react-intl';

export const highlightMessages: {
	clearColors: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	highlight: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	highlightFloatingToolbar: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	removeColor: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	removeHighlight: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	clearColors: {
		id: 'fabric.editor.highlight.clearColors',
		defaultMessage: 'Clear all colors',
		description: 'Button content for clearing the applied text and/ or highlight colors.',
	},
	highlight: {
		id: 'fabric.editor.highlight',
		defaultMessage: 'Highlight color',
		description:
			'Label for the highlight color menu option in the primary editor toolbar. Opens up the color palette for the highlight colors.',
	},
	highlightFloatingToolbar: {
		id: 'fabric.editor.highlightFloatingToolbar',
		defaultMessage: 'Highlight',
		description:
			'Button content for the highlight color menu option in the editor floating toolbar. Opens up the color palette for the highlight colors.',
	},
	removeColor: {
		id: 'fabric.editor.highlight.removeColor',
		defaultMessage: 'Remove color',
		description:
			'Button content for the combined text highlight and color menu, removes either the applied text color or highlight color.',
	},
	removeHighlight: {
		id: 'fabric.editor.highlight.removeHighlight',
		defaultMessage: 'Remove highlight',
		description: 'Button content for removing the applied highlight color.',
	},
});
