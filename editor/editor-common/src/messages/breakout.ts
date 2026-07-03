import { defineMessages } from 'react-intl';

export const messages: {
	fullWidthLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	maxWidthLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizeCodeBlock: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizeElement: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizeExpand: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizeHandle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizeLayout: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizePanel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizeRule: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	wideWidthLabel: {
		defaultMessage: string;
		description: string;
		id: string;
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
		description:
			'Label for a toolbar button that resizes the current editor element (e.g. a table, image, or code block) to wide display mode, extending it beyond the default content width.',
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
	resizeRule: {
		id: 'fabric.editor.breakout.resizeRule',
		defaultMessage: 'Resize divider',
		description: 'Tooltip displayed on custom divider width resize handle',
	},
	resizePanel: {
		id: 'fabric.editor.breakout.resizePanel',
		defaultMessage: 'Resize panel',
		description: 'Tooltip displayed on custom panel width resize handle',
	},
});
