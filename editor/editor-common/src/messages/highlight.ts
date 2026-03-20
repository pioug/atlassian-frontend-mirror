import { defineMessages } from 'react-intl-next';

export const highlightMessages: {
	highlight: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	highlightFloatingToolbar: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	removeColor: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	removeHighlight: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
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
