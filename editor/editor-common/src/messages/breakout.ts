import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
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
		description: 'Resize handle',
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
