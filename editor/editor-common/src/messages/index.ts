// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import { defineMessages } from 'react-intl-next';

export { alignmentMessages } from './alignment';
export { annotationMessages } from './annotation';
export { messages as breakoutMessages } from './breakout';
export { messages as blockMenuMessages } from './block-menu';
export { messages as blockTypeMessages } from './block-type';
export { codeBidiWarningMessages } from './codeBidiWarning';
export { colorPickerButtonMessages } from './color-picker-button';
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
export { elementInsertSidePanel } from './element-insert-side-panel';
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
export { mediaEditingMessages } from './media-editing';
export { selectionExtensionMessages } from './selection-extension';
export { selectionToolbarMessages } from './selection-toolbar';
export { contextPanelMessages } from './context-panel';
export { trackChangesMessages } from './track-changes';
export { syncBlockMessages } from './syncBlock';
export { limitedModeMessages } from './limited-mode';
export { companyHubTextColorMessages } from './company-hub-text-color';

export default defineMessages({
	layoutFixedWidth: {
		id: 'fabric.editor.layoutFixedWidth',
		defaultMessage: 'Back to center',
		description: 'Display your element (image, table, extension, etc) as standard width',
	},
	layoutStateFixedWidth: {
		id: 'fabric.editor.layoutStateFixedWidth',
		defaultMessage: 'Centered',
		description: 'Displaying your element (image, table, extension, etc) as standard width',
	},
	layoutWide: {
		id: 'fabric.editor.layoutWide',
		defaultMessage: 'Go wide',
		description: 'Display your element (image, table, extension, etc) wider than normal',
	},
	layoutStateWide: {
		id: 'fabric.editor.layoutStateWide',
		defaultMessage: 'Wide',
		description: 'Displaying your element (image, table, extension, etc) wider than normal',
	},
	layoutFullWidth: {
		id: 'fabric.editor.layoutFullWidth',
		defaultMessage: 'Go full width',
		description: 'Display your element (image, table, extension, etc) as full width',
	},
	layoutStateFullWidth: {
		id: 'fabric.editor.layoutStateFullWidth',
		defaultMessage: 'Full width',
		description: 'Displaying your element (image, table, extension, etc) as full width',
	},
	alignImageRight: {
		id: 'fabric.editor.alignImageRight',
		defaultMessage: 'Align right',
		description:
			'The text is shown as a button in the image toolbar when the user wants to align an image to the right side of the page.',
	},
	alignImageCenter: {
		id: 'fabric.editor.alignImageCenter',
		defaultMessage: 'Align center',
		description:
			'The text is shown as a button in the image toolbar when the user wants to align an image to the center of the page.',
	},
	alignImageLeft: {
		id: 'fabric.editor.alignImageLeft',
		defaultMessage: 'Align left',
		description:
			'The text is shown as a button in the image toolbar when the user wants to align an image to the left side of the page.',
	},
	delete: {
		id: 'fabric.editor.delete',
		defaultMessage: 'Delete',
		description: 'Delete the element (image, panel, table, etc.) from your document',
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
		description:
			'The text is shown as a link or button in the editor when the user wants to open the selected link in a new browser window.',
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
		description:
			'The text is shown as a tooltip label in the editor to describe an action item element when the user interacts with it.',
	},
	bulletList: {
		id: 'fabric.editor.tooltip.bulletList',
		defaultMessage: 'a list',
		description:
			'The text is shown as a tooltip label in the editor to describe a bullet list element when the user interacts with it.',
	},
	nestedExpand: {
		id: 'fabric.editor.tooltip.nestedExpand',
		defaultMessage: 'a nested expand',
		description:
			'The text is shown as a tooltip label in the editor to describe a nested expand element when the user interacts with it.',
	},
	decisionList: {
		id: 'fabric.editor.tooltip.decisionList',
		defaultMessage: 'a decision list',
		description:
			'The text is shown as a tooltip label in the editor to describe a decision list element when the user interacts with it.',
	},
	defaultBlockNode: {
		id: 'fabric.editor.tooltip.defaultBlockNode',
		defaultMessage: 'a block node',
		description:
			'The text is shown as a tooltip label in the editor to describe a generic block node element when the user interacts with it.',
	},
	panel: {
		id: 'fabric.editor.tooltip.blockPanel',
		defaultMessage: 'a panel',
		description:
			'The text is shown as a tooltip label in the editor to describe a panel element when the user interacts with it.',
	},
	blockquote: {
		id: 'fabric.editor.blockquote',
		defaultMessage: 'a quote',
		description:
			'The text is shown as a tooltip label in the editor to describe a blockquote element when the user interacts with it.',
	},
	timeUpdated: {
		id: 'fabric.editor.time.updated',
		defaultMessage: 'Updated',
		description:
			'The text is shown as a label in the editor to indicate when the content was last updated by a user.',
	},
	timeViewed: {
		id: 'fabric.editor.time.viewed',
		defaultMessage: 'Viewed',
		description:
			'The text is shown as a label in the editor to indicate when the content was last viewed by a user.',
	},
	timeAgo: {
		id: 'fabric.editor.time.ago',
		defaultMessage: 'ago',
		description:
			'The text is shown as a label suffix after a time value to indicate that the action occurred in the past, for example "5 minutes ago".',
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
	viewMore: {
		id: 'fabric.editor.overflowMenuViewMore',
		defaultMessage: 'View more',
		description:
			'The text is shown as a button in the editor toolbar overflow menu when additional toolbar options are available for the user to view.',
	},
	imageEdit: {
		id: 'fabric.editor.imageEdit',
		defaultMessage: 'Edit image',
		description: 'Crop, flip or rotate the image',
	},
	error: {
		id: 'fabric.editor.error.message.label',
		defaultMessage: 'Error',
		description:
			'The text is shown as a label for the error message icon in the editor when an operation fails or an error occurs.',
	},
	success: {
		id: 'fabric.editor.success.message.label',
		defaultMessage: 'Success',
		description: 'Label for success message icon',
	},
});
