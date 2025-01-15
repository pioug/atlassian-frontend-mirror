/**
 * Commented out for hot-114295
 */
export const noop = () => {};
// import { TransactionSpec as CMTransactionSpec } from '@codemirror/state';

// /**
//  *
//  * Compares the updated text with the current to determine the transaction to fire
//  * in the CodeMirror editor.
//  *
//  * @param curText string - the current CodeMirror text
//  * @param newText string - the new CodeMirror text
//  * @param updateCallback Callback to process the CodeMirror transaction
//  */
// export const updateCMSelection = (
// 	curText: string,
// 	newText: string,
// 	updateCallback: (value: CMTransactionSpec) => void,
// ) => {
// 	if (newText !== curText) {
// 		let start = 0,
// 			curEnd = curText.length,
// 			newEnd = newText.length;
// 		while (start < curEnd && curText.charCodeAt(start) === newText.charCodeAt(start)) {
// 			++start;
// 		}
// 		while (
// 			curEnd > start &&
// 			newEnd > start &&
// 			curText.charCodeAt(curEnd - 1) === newText.charCodeAt(newEnd - 1)
// 		) {
// 			curEnd--;
// 			newEnd--;
// 		}
// 		updateCallback({
// 			changes: {
// 				from: start,
// 				to: curEnd,
// 				insert: newText.slice(start, newEnd),
// 			},
// 		});
// 	}
// };
