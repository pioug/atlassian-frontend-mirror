import { defineMessages } from 'react-intl';

export const messages: {
	maxWidthLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	fullWidthLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	wideWidthLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	resizeHandle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	resizeExpand: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	resizeCodeBlock: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	resizeLayout: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	resizeElement: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	maxWidthLabel: {
		id: 'fabric.editor.breakoutMaxWidthLabel',
		defaultMessage: 'Max-width',
		description: 'Resize current element to max-width mode',
	},
	fullWidthLabel: {
		id: 'fabric.editor.breakoutFullWidthLabel',
		defaultMessage: 'Full-width',
		description: 'Resize current element to full-width mode',
	},
	wideWidthLabel: {
		id: 'fabric.editor.breakoutWideWidthLabel',
		defaultMessage: 'Wide',
		description: 'Resize current element to wide mode',
	},
	resizeHandle: {
		id: 'fabric.editor.resizeHandle',
		defaultMessage: 'Resize handle',
		description:
			'Label for the resize handle element displayed on content blocks in the editor, used to allow users to drag and resize the width of the element.',
	},
	resizeExpand: {
		id: 'fabric.editor.breakout.resizeExpand',
		defaultMessage: 'Resize expand',
		description: 'Tooltip displayed on custom expand width resize handle',
	},
	resizeCodeBlock: {
		id: 'fabric.editor.breakout.resizeCodeBlock',
		defaultMessage: 'Resize code snippet',
		description: 'Tooltip displayed on custom code block width resize handle',
	},
	resizeLayout: {
		id: 'fabric.editor.breakout.resizeLayout',
		defaultMessage: 'Resize layout',
		description: 'Tooltip displayed on custom layout width resize handle',
	},
	resizeElement: {
		id: 'fabric.editor.breakout.resizeElement',
		defaultMessage: 'Resize element',
		description: 'Tooltip displayed on custom element (node) width resize handle',
	},
});
