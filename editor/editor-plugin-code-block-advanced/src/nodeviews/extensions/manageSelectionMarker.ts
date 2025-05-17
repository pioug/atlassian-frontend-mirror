import { type Extension } from '@codemirror/state';
import { EditorView as CodeMirror } from '@codemirror/view';

import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { CodeBlockAdvancedPlugin } from '../../codeBlockAdvancedPluginType';

/**
 * Hides selection marker decoration when focused on codemirror editor and re-enables on blur
 *
 * @param api
 * @returns CodeMirror Extension
 * @example
 */
export const manageSelectionMarker = (
	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined,
): Extension => {
	let decoHide: (() => void) | undefined;
	return CodeMirror.focusChangeEffect.of((_state, focusing) => {
		if (focusing) {
			api?.selectionMarker?.actions.queueHideDecoration((hideDecoration) => {
				decoHide = hideDecoration;
			});
		} else {
			decoHide?.();
		}
		return null;
	});
};
