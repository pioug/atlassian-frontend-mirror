import { defineMessages } from 'react-intl-next';

export const unsupportedContentMessages = defineMessages({
	unsupportedInlineContent: {
		id: 'fabric.editor.unsupportedInlineContent',
		defaultMessage: 'Unsupported content',
		description:
			'The text is shown as an inline label in the editor when a content node type is not supported for display. It appears alongside a question mark icon that provides more details via a tooltip.',
	},
	unsupportedBlockContent: {
		id: 'fabric.editor.unsupportedBlockContent',
		defaultMessage: 'This editor does not support displaying this content',
		description:
			'The text is shown as a block-level message in the editor when a content block type is not supported for display. It appears centered within a dashed border container alongside a question mark icon that provides more details via a tooltip.',
	},
	unsupportedContentTooltip: {
		id: 'fabric.editor.unsupportedContentTooltip',
		defaultMessage:
			'Content is not available in this editor, this will be preserved when you edit and save',
		description:
			'The text is shown as tooltip content when the user hovers over the question mark icon on an unsupported content node in the editor. It reassures users that unsupported content will not be lost when they edit and save the document.',
	},
});
