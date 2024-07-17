import { defineMessages } from 'react-intl-next';

export const helpDialogMessages = defineMessages({
	editorHelp: {
		id: 'fabric.editor.editorHelp',
		defaultMessage: 'Editor help',
		description: 'Title of editor help dialog.',
	},
	helpDialogTips: {
		id: 'fabric.editor.helpDialogTips',
		defaultMessage: 'Press {keyMap} to quickly open this dialog at any time',
		description: 'Hint about how to open a dialog quickly using a shortcut.',
	},
	keyboardShortcuts: {
		id: 'fabric.editor.keyboardShortcuts',
		defaultMessage: 'Keyboard shortcuts',
		description: '',
	},
	markdown: {
		id: 'fabric.editor.markdown',
		defaultMessage: 'Markdown',
		description: 'It is a name of popular markup language.',
	},
	pastePlainText: {
		id: 'fabric.editor.pastePlainText',
		defaultMessage: 'Paste plain text',
		description: '',
	},
	CheckUncheckActionItem: {
		id: 'fabric.editor.checkUncheckActionItem',
		defaultMessage: 'Toggle action item',
		description: 'For Check/Uncheck Action item use shortcut',
	},
	InsertTableColumn: {
		id: 'fabric.editor.insertTableColumn',
		defaultMessage: 'Insert table column',
		description: 'For insert table column',
	},
	InsertTableRow: {
		id: 'fabric.editor.insertTableRow',
		defaultMessage: 'Insert table row',
		description: 'For insert table row',
	},
	altText: {
		id: 'fabric.editor.altText',
		defaultMessage: 'Alt text',
		description: 'Alternative text for image.',
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
	decreaseSize: {
		id: 'fabric.editor.decreaseSize',
		defaultMessage: 'Decrease table or media size',
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
		description: 'Focus table resize handle',
	},
	closeHelpDialog: {
		id: 'fabric.editor.closeHelpDialog',
		defaultMessage: 'Close help dialog',
		description: '',
	},
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
