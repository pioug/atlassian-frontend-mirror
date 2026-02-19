import type { ChangeSpec } from '@codemirror/state';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
/**
 *
 * Compares the updated text with the current to determine the transaction to fire
 * in the CodeMirror editor.
 *
 * @param curText string - the current CodeMirror text
 * @param newText string - the new ProseMirror text
 * @returns The changes or undefined if no change
 */

const N_LINE_FEED = '\n'.charCodeAt(0);
const R_LINE_FEED = '\r'.charCodeAt(0);

/**
 * Example of CRLF differences:
 * newText: 'abc\r\ndef\r\nghi'
 * curText: 'abc\ndef\nghi'
 */
export const getCMSelectionChanges = (curText: string, newText: string): ChangeSpec | undefined => {
	if (newText !== curText) {
		let curStart = 0,
			newStart = 0;
		let start = 0,
			curEnd = curText.length,
			newEnd = newText.length;

		if (expValEquals('platform_editor_fix_advanced_codeblocks_crlf_patch', 'isEnabled', true)) {
			while (
				curStart < curEnd &&
				(curText.charCodeAt(curStart) === newText.charCodeAt(newStart) ||
					(newText.charCodeAt(newStart) === R_LINE_FEED &&
						curText.charCodeAt(curStart) === N_LINE_FEED))
			) {
				if (
					newText.charCodeAt(newStart) === R_LINE_FEED &&
					curText.charCodeAt(curStart) === N_LINE_FEED &&
					newText.charCodeAt(newStart + 1) === N_LINE_FEED
				) {
					newStart++;
				}
				curStart++;
				newStart++;
			}
			while (
				curEnd > curStart &&
				newEnd > newStart &&
				(curText.charCodeAt(curEnd - 1) === newText.charCodeAt(newEnd - 1) ||
					(newText.charCodeAt(newEnd - 1) === N_LINE_FEED &&
						curText.charCodeAt(curEnd - 1) === N_LINE_FEED))
			) {
				if (
					newText.charCodeAt(newEnd - 1) === N_LINE_FEED &&
					curText.charCodeAt(curEnd - 1) === N_LINE_FEED &&
					newText.charCodeAt(newEnd - 2) === R_LINE_FEED
				) {
					newEnd--;
				}
				curEnd--;
				newEnd--;
			}
			return {
				from: curStart,
				to: curEnd,
				insert: newText.slice(newStart, newEnd),
			};
		} else {
			while (start < curEnd && curText.charCodeAt(start) === newText.charCodeAt(start)) {
				++start;
			}
			while (
				curEnd > start &&
				newEnd > start &&
				curText.charCodeAt(curEnd - 1) === newText.charCodeAt(newEnd - 1)
			) {
				curEnd--;
				newEnd--;
			}
			return {
				from: start,
				to: curEnd,
				insert: newText.slice(start, newEnd),
			};
		}
	}
};
