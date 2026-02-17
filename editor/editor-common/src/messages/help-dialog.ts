import { defineMessages } from 'react-intl-next';

export const helpDialogMessages = defineMessages({
	editorHelp: {
		id: 'fabric.editor.editorHelp',
		defaultMessage: 'Editor help',
		description:
			'The text is shown as a title for the editor help dialog when the user opens the help panel to view keyboard shortcuts and formatting options.',
	},
	helpDialogTips: {
		id: 'fabric.editor.helpDialogTips',
		defaultMessage: 'Press {keyMap} to quickly open this dialog at any time',
		description: 'Hint about how to open a dialog quickly using a shortcut.',
	},
	keyboardShortcuts: {
		id: 'fabric.editor.keyboardShortcuts',
		defaultMessage: 'Keyboard shortcuts',
		description:
			'The text is shown as a heading in the editor help dialog to label the section that lists available keyboard shortcuts for the editor.',
	},
	markdown: {
		id: 'fabric.editor.markdown',
		defaultMessage: 'Markdown',
		description: 'It is a name of popular markup language.',
	},
	pastePlainText: {
		id: 'fabric.editor.pastePlainText',
		defaultMessage: 'Paste plain text',
		description:
			'The text is shown as a label for a keyboard shortcut in the editor help dialog that describes how to paste content without formatting.',
	},
	CheckUncheckActionItem: {
		id: 'fabric.editor.checkUncheckActionItem',
		defaultMessage: 'Toggle action item',
		description:
			'Keyboard shortcut description shown in the help dialog. Explains how to toggle or check/uncheck action items in the editor using a keyboard shortcut.',
	},
	InsertTableColumn: {
		id: 'fabric.editor.insertTableColumn',
		defaultMessage: 'Insert table column',
		description:
			'The text is shown as a label for a keyboard shortcut in the editor help dialog that describes how to insert a new column into a table.',
	},
	InsertTableRow: {
		id: 'fabric.editor.insertTableRow',
		defaultMessage: 'Insert table row',
		description:
			'The text is shown as a label for a keyboard shortcut in the editor help dialog that describes how to insert a new row into a table.',
	},
	altText: {
		id: 'fabric.editor.altText',
		defaultMessage: 'Alt text',
		description:
			'The text is shown as a label for a keyboard shortcut in the editor help dialog that describes how to add or edit alternative text for an image.',
	},
	selectTableRow: {
		id: 'fabric.editor.selectTableRow',
		defaultMessage: 'Select table row',
		description: 'Hint for selecting a table row using a shortcut',
	},
	selectTableColumn: {
		id: 'fabric.editor.selectTableColumn',
		defaultMessage: 'Select table column',
		description: 'Hint for selecting a table column using a shortcut',
	},
	selectColumnResize: {
		id: 'fabric.editor.selectColumnResize',
		defaultMessage: 'Select column resize',
		description: 'Hint for selecting a column resize a shortcut',
	},
	increaseSize: {
		id: 'fabric.editor.increaseSize',
		defaultMessage: 'Increase table or media size',
		description:
			'The text is shown as an shortcut description in help dialog modal, when the user uses the described shortcut, he is able to increase the width of the selected element. Optimal characters less than 21.',
	},
	increaseElementSize: {
		id: 'fabric.editor.increaseElementSize',
		defaultMessage: 'Increase element size',
		description:
			'The text is shown as an shortcut description in help dialog modal, when the user uses the described shortcut, he is able to increase the width of the selected element. Optimal characters less than 21.',
	},
	decreaseSize: {
		id: 'fabric.editor.decreaseSize',
		defaultMessage: 'Decrease table or media size',
		description:
			'The text is shown as an shortcut description in help dialog modal, when the user uses the described shortcut, he is able to decrease the width of the selected element. Optimal characters less than 21.',
	},
	decreaseElementSize: {
		id: 'fabric.editor.decreaseElementSize',
		defaultMessage: 'Decrease element size',
		description:
			'The text is shown as an shortcut description in help dialog modal, when the user uses the described shortcut, he is able to decrease the width of the selected element. Optimal characters less than 21.',
	},
	openCellOptions: {
		id: 'fabric.editor.openCellOptions',
		defaultMessage: 'Open cell options',
		description: 'Keyboard shortcut to open cell options.',
	},
	focusTableResizeHandle: {
		id: 'fabric.editor.focusTableResizeHandle',
		defaultMessage: 'Focus table resize handle',
		description:
			'The text is shown as a label for a keyboard shortcut in the editor help dialog that describes how to move focus to the table resize handle for resizing columns.',
	},
	closeHelpDialog: {
		id: 'fabric.editor.closeHelpDialog',
		defaultMessage: 'Close help dialog',
		description:
			'The text is shown as a label for a keyboard shortcut in the editor help dialog that describes how to close the help dialog and return to the editor.',
	},
	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO: Move it inside quick insert plugin
	quickInsert: {
		id: 'fabric.editor.quickInsert',
		defaultMessage: 'Quick insert',
		description: 'Name of a feature, which let you insert items quickly.',
	},
	highlightColor: {
		id: 'fabric.editor.highlightColor',
		defaultMessage: 'Toggle highlight color palette',
		description: 'Keyboard shortcut to toggle highlight color palette.',
	},
});
