// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
// @deprecated
// @private This rank is not stable and should not be trusted. If you need to change this file, please let the Editor lego team know about it
export const rankEditorPlugins = {
	plugins: [
		'featureFlagsContextPlugin',
		'compositionPlugin',
		'inlineCursorTargetPlugin',
		'typeAhead',
		'typeAheadInsertItem',
		'focusHandlerPlugin',
		'frozenEditor',
		'submitEditor',
		'saveOnEnter',
		'customAutoformatting',
		'newlinePreserveMarksPlugin',
		'imageUpload',
		'imageUploadInputRule',
		'clipboard',
		'paste',
		'pasteKeymap',
		'mention',
		'mentionInputRule',
		'mentionKeymap',
		'emoji',
		'placeholderText',
		'emojiInputRule',
		'emojiKeymap',
		'emojiAsciiInputRule',
		'blockType',
		'quickInsert',
		'tasksAndDecisions',
		'blockTypeInputRule',
		'tasksAndDecisionsInputRule',
		'list',
		'typeAheadKeymap',
		'typeAheadInputRule',
		'date', // Needs to be before indentation to handle tab into input field
		'dateKeymap',
		// This should be always after `typeAheadKeymap` & `emojiKeymap`
		'indentationKeymap',
		'textColor',
		'highlight',
		'highlightKeymap',
		'alignmentPlugin',
		'listInputRule',
		'listKeymap',
		'codeBlock',
		'codeBlockIDEKeyBindings',
		'codeBlockKeyMap',
		'textFormatting',
		'textFormattingCursor',
		'textFormattingInputRule',
		'textFormattingSmartRule',
		'textFormattingClear',
		'textFormattingKeymap',
		// task/decisions keymap needs to be above table keymap so can indent actions in a table
		'tasksAndDecisionsKeyMap',
		// expand and table keymaps need to be above selection keymap to add their custom selection behaviour:
		// https://product-fabric.atlassian.net/wiki/spaces/E/pages/1113098008/Selection+Guide#Special-Cases
		'expandKeymap',
		'tableSelectionKeymap',
		'tableKeymap',
		'captionKeymap',
		// media keymap above selection keymap to allow navigating past the mediaSingle node
		'mediaKeymap',
		// selection keymap needs to be above gap cursor keymap so it can set node selections from
		// left/right arrows
		'selectionKeymap',
		'gapCursorKeymap',
		'gapCursor',
		'syncUrlText',
		'fakeCursorToolbarPlugin',
		'hyperLink',
		'table',
		'tableDecorations',
		'hyperlinkInputRule',
		'tablePMColResizing',
		'hyperlinkKeymap',
		'tableColResizing',
		'undoRedoKeyMap',
		'blockTypeKeyMap',
		'tableEditing',
		'filterStepsPlugin',
		'pmCollab',
		'collab',
		'ruleInputRule',
		'ruleKeymap',
		'panel',
		'media',
		'mediaSingleKeymap',
		'mediaEditor',
		'unsupportedContent',
		'jiraIssue',
		'helpDialog',
		'helpDialogKeymap',
		'macro',
		'expand',
		'extension',
		'layout',
		'contextPanel',
		'selectionToolbar',
		'floatingToolbar',
		'clearMarksOnChange',
		'reactNodeView',
		'history',
		'undoRedoPlugin',
		'codeBlockIndent',
		'placeholder',
		'width',
		'maxContentSize',
		'multilineContent',
		'grid',
		'mobileDimensions',
		'scrollGutterPlugin',
		'analytics',
		'findReplace',
		'selection',
		'avatarGroup',
		'viewUpdateSubscription',
		'beforePrimaryToolbar',
		'inlineCode',
	],
	nodes: [
		'doc',
		'paragraph',
		'text',
		'bulletList',
		'orderedList',
		'listItem',
		'heading',
		'blockquote',
		'codeBlock',
		'rule',
		'panel',
		'mention',
		'confluenceUnsupportedBlock',
		'confluenceUnsupportedInline',
		'unsupportedBlock',
		'unsupportedInline',
		'confluenceJiraIssue',
		'hardBreak',
		'emoji',
		'placeholder',
		'mediaSingle',
		'mediaGroup',
		'table',
		'expand',
		'nestedExpand',
		'media',
		'tableHeader',
		'decisionList',
		'tableRow',
		'decisionItem',
		'tableCell',
		'taskList',
		'taskItem',
		'extension',
		'bodiedExtension',
		'multiBodiedExtension',
		'inlineExtension',
		'layoutSection',
		'layoutColumn',
		'inlineCard',
		'blockCard',
		'embedCard',
	],
	marks: [
		// Fragment mark is both for inline and block elements
		'fragment',

		// Inline marks
		'link',
		'em',
		'strong',
		'textColor',
		'backgroundColor',
		'strike',
		'subsup',
		'underline',
		'code',
		'typeAheadQuery',

		// Block marks
		'alignment',
		'breakout',
		'indentation',
		'annotation',
		'dataConsumer',

		'border',

		// Unsupported mark
		'unsupportedMark',
		'unsupportedNodeAttribute',
	],
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
// @deprecated
// @private This rank is not stable and should not be trusted. If you need to change this file, please let the Editor lego team know about it
export function sortByOrder(item: 'plugins' | 'nodes' | 'marks') {
	return function (a: { name: string }, b: { name: string }): number {
		return rankEditorPlugins[item].indexOf(a.name) - rankEditorPlugins[item].indexOf(b.name);
	};
}

// while functionally the same, in order to avoid potentially rewriting the ~10
// existing implementations of the above function I decided creating a separate
// function avoided that whole mess. If someone can think of a better way to implement
// the above and below into a single function please do so

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
// @deprecated
// @private This rank is not stable and should not be trusted. If you need to change this file, please let the Editor lego team know about it
export function sortByOrderWithTypeName(item: 'plugins' | 'nodes' | 'marks') {
	return function (a: { type: { name: string } }, b: { type: { name: string } }): number {
		return (
			rankEditorPlugins[item].indexOf(a.type.name) - rankEditorPlugins[item].indexOf(b.type.name)
		);
	};
}
