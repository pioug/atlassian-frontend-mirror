import { defineMessages } from 'react-intl-next';

export { aiDefinitionsMessages } from './ai-definitions';
export { alignmentMessages } from './alignment';
export { annotationMessages } from './annotation';
export { messages as blockTypeMessages } from './block-type';
export { codeBidiWarningMessages } from './codeBidiWarning';
export { linkMessages } from './link';
export { linkToolbarMessages } from './link-toolbar';
export { unsupportedContentMessages } from './unsupportedContent';
export { codeBlockButtonMessages } from './codeBlockButton';
export { toolbarInsertBlockMessages } from './insert-block';
export { toolbarMessages as mediaAndEmbedToolbarMessages } from './media-and-embed-toolbar';
export { messages as cardMessages } from './card';
export { messages as fullPageMessages } from './full-page';
export { toolbarMessages } from './toolbar';
export { messages as tableMessages } from './table';
export { messages as listMessages } from './list';
export { messages as undoRedoMessages } from './undo-redo';
export { messages as statusMessages } from './status';
export { messages as dateMessages } from './date';
export { toolbarMessages as layoutMessages } from './layout';
export { messages as indentationMessages } from './indentation';
export { avatarGroupMessages } from './avatar-group';
export { findReplaceMessages } from './find-replace';
export { textColorMessages } from './text-color';
export { tasksAndDecisionsMessages } from './tasks-and-decsisions';
export { placeholderTextMessages } from './placeholder-text';
export { pasteOptionsToolbarMessages } from './paste-options-toolbar';
export { panelMessages } from './panel';
export { mentionMessages } from './mentions';
export { helpDialogMessages } from './help-dialog';
export { highlightMessages } from './highlight';
export { messages as blockControlsMessages } from './block-controls';
export { mediaInsertMessages } from './media-insert';

export default defineMessages({
	layoutFixedWidth: {
		id: 'fabric.editor.layoutFixedWidth',
		defaultMessage: 'Back to center',
		description: 'Display your element (image, table, extension, etc) as standard width',
	},
	layoutWide: {
		id: 'fabric.editor.layoutWide',
		defaultMessage: 'Go wide',
		description: 'Display your element (image, table, extension, etc) wider than normal',
	},
	layoutFullWidth: {
		id: 'fabric.editor.layoutFullWidth',
		defaultMessage: 'Go full width',
		description: 'Display your element (image, table, extension, etc) as full width',
	},
	alignImageRight: {
		id: 'fabric.editor.alignImageRight',
		defaultMessage: 'Align right',
		description: 'Aligns image to the right',
	},
	alignImageCenter: {
		id: 'fabric.editor.alignImageCenter',
		defaultMessage: 'Align center',
		description: 'Aligns image to the center',
	},
	alignImageLeft: {
		id: 'fabric.editor.alignImageLeft',
		defaultMessage: 'Align left',
		description: 'Aligns image to the left',
	},
	remove: {
		id: 'fabric.editor.remove',
		defaultMessage: 'Remove',
		description: 'Delete the element (image, panel, table, etc.) from your document',
	},
	removeEmoji: {
		id: 'fabric.editor.removeEmoji',
		defaultMessage: 'Remove emoji',
		description: 'Remove the emoji panel icon from custom panel',
	},
	visit: {
		id: 'fabric.editor.visit',
		defaultMessage: 'Open link in a new window',
		description: 'Open the link in a new window',
	},
	inviteToEditButtonTitle: {
		id: 'fabric.editor.editMode.inviteToEditButton.title',
		defaultMessage: 'Invite to edit',
		description: 'Invite another user to edit the current document',
	},
	saveButton: {
		id: 'fabric.editor.saveButton',
		defaultMessage: 'Save',
		description: 'Submit and save a comment or document',
	},
	cancelButton: {
		id: 'fabric.editor.cancelButton',
		defaultMessage: 'Cancel',
		description: 'Discard the current comment or document',
	},
	taskList: {
		id: 'fabric.editor.tooltip.taskList',
		defaultMessage: 'an action item',
		description: 'an action item in the Editor',
	},
	bulletList: {
		id: 'fabric.editor.tooltip.bulletList',
		defaultMessage: 'a list',
		description: 'a list item in the Editor',
	},
	nestedExpand: {
		id: 'fabric.editor.tooltip.nestedExpand',
		defaultMessage: 'a nested expand',
		description: 'expand node which is nested',
	},
	decisionList: {
		id: 'fabric.editor.tooltip.decisionList',
		defaultMessage: 'a decision list',
		description: 'a list of decisions',
	},
	defaultBlockNode: {
		id: 'fabric.editor.tooltip.defaultBlockNode',
		defaultMessage: 'a block node',
		description: 'a block node element',
	},
	panel: {
		id: 'fabric.editor.tooltip.blockPanel',
		defaultMessage: 'a panel',
		description: 'Panel node in the Editor',
	},
	blockquote: {
		id: 'fabric.editor.blockquote',
		defaultMessage: 'a quote',
		description: 'a quote node',
	},
	timeUpdated: {
		id: 'fabric.editor.time.updated',
		defaultMessage: 'Updated',
		description: 'Time last updated',
	},
	timeViewed: {
		id: 'fabric.editor.time.viewed',
		defaultMessage: 'Viewed',
		description: 'Time last viewed',
	},
	timeAgo: {
		id: 'fabric.editor.time.ago',
		defaultMessage: 'ago',
		description: 'Some time ago',
	},
	copyToClipboard: {
		id: 'fabric.editor.copyToClipboard',
		defaultMessage: 'Copy',
		description: 'Copy the whole content of the element to your clipboard',
	},
	copiedToClipboard: {
		id: 'fabric.editor.copiedToClipboard',
		defaultMessage: 'Copied!',
		description: 'Copied the whole content of the element to clipboard',
	},
});
