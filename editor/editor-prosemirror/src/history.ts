/* eslint-disable @atlaskit/volt-strict-mode/no-re-exports -- These should be re-exported as they are an external dependency */
export {
	closeHistory,
	history,
	undo,
	redo,
	undoDepth,
	redoDepth,
	redoNoScroll,
	undoNoScroll,
	isHistoryTransaction,
} from 'prosemirror-history';
