import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { findCodeBlock } from './utils';

export const codeBlockAutoFullStopTransformPluginKey = new PluginKey(
	'codeBlockAutoFullStopTransformPluginKey',
);
export function codeBlockAutoFullStopTransformPlugin() {
	return new SafePlugin({
		key: codeBlockAutoFullStopTransformPluginKey,
		appendTransaction(
			_transactions: readonly Transaction[],
			oldState: EditorState,
			newState: EditorState,
		) {
			if (!fg('code_block_auto_insertion_bug_fix')) {
				return undefined;
			}

			// We need to compare the old and new state to isloate auto insertion of fullstop on mac
			const { tr: trNew } = newState;
			const { tr: trOld } = oldState;
			const { from: fromOld } = trOld.selection;
			const { from: fromNew, to: toNew } = trNew.selection;

			const isCodeBlock =
				!!findCodeBlock(oldState, trOld.selection) && !!findCodeBlock(newState, trNew.selection);

			/**
			 * Mac will auto insert a fullstop when the user double taps the space key after some content.
			 * Line number decorators are assumed content so on new lines the fullstop is inserted.
			 *
			 * - When a fulltop is auto inserted the new states selection is the same, the old state selection is one position less
			 * - The text returned for the old state returns as a space with the selection from - 1
			 * - The text returned for the new state returns as a fullstop with the selection from - 2 to from -1
			 *
			 * This is enough conditional logic to isoloate the auto insertion of the fullstop on mac
			 *
			 * There are some solutions to this problem in codemirror which can be read further here
			 * https://discuss.codemirror.net/t/dot-being-added-when-pressing-space-repeatedly/3899
			 */

			// both selections must be of code block early exit
			if (browser.mac && fromNew === toNew && fromNew === fromOld + 1 && isCodeBlock) {
				// detect when '.' is inserted when the previous state was a space ' '
				try {
					const textBetweenBefore = trOld.doc.textBetween(fromOld - 1, fromOld); // ' '
					const textBetweenAfter = trNew.doc.textBetween(fromNew - 2, fromNew - 1); // '.'
					if (textBetweenBefore === ' ' && textBetweenAfter === '.') {
						trNew.delete(fromNew - 2, fromNew); // remove the fullstop
						trNew.insertText('  ', fromNew - 2); // insert double space

						return trNew;
					}
				} catch (error) {
					// if for some reason textBetween fails, just return the new transaction as is by defaut.
					return undefined;
				}
			}

			return undefined;
		},
	});
}
