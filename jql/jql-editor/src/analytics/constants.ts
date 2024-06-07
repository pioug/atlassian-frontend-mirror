export enum Action {
	CLICKED = 'clicked',
	RETRIEVE_FAILED = 'retrieveFailed',
	RETRIEVED = 'retrieved',
	SELECTED = 'selected',
	VIEWED = 'viewed',
}

export enum ActionSubject {
	BUTTON = 'button',
	AUTOCOMPLETE_OPTION = 'autocompleteOption',
	ERROR_MESSAGE = 'errorMessage',
}

export enum ActionSubjectId {
	EDITOR_EXPAND = 'jqlEditorExpand',
	EDITOR_SEARCH = 'jqlEditorSearch',
	EDITOR_HELP = 'jqlEditorHelp',
	JQL_RESULT = 'jqlResult',
}
