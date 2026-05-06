import { defineMessages } from 'react-intl';
export const editorMessages: {
	editorAssistiveLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	fullPageEditorAssistiveLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	editorAssistiveLabel: {
		id: 'fabric.editor.editorAssistiveLabel',
		defaultMessage: 'Main content area, start typing to enter text.',
		description: 'Text that is read out by screen reader when the main editor is in focus',
	},
	fullPageEditorAssistiveLabel: {
		id: 'fabric.editor.fullPageEditorAssistiveLabel',
		defaultMessage: 'Page editing area, start typing to enter text.',
		description:
			'The aria-label assigned to the full page editor content area, read by screen readers when a user focuses the editing region.',
	},
});
