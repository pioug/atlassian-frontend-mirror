import { defineMessages } from 'react-intl-next';
export const editorMessages = defineMessages({
	editorAssistiveLabel: {
		id: 'fabric.editor.editorAssistiveLabel',
		defaultMessage: 'Main content area, start typing to enter text.',
		description: 'Text that is read out by screen reader when the main editor is in focus',
	},
	fullPageEditorAssistiveLabel: {
		id: 'fabric.editor.fullPageEditorAssistiveLabel',
		defaultMessage: 'Page editing area, start typing to enter text.',
		description: 'The aria-label for the full page editor',
	},
});
