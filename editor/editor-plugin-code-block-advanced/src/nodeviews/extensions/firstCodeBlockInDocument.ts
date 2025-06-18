import { type Extension } from '@codemirror/state';
import { EditorView as CodeMirror } from '@codemirror/view';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

/**
 * Keeps 'first-node-in-document' class if it was added to a codeBlock by
 * platform/packages/editor/editor-plugin-block-controls/src/pm-plugins/first-node-dec-plugin.ts
 *
 * @param getPos
 * @returns CodeMirror Extension
 * @example
 */
export const firstCodeBlockInDocument = (getPos: () => number | undefined): Extension => {
	if (
		expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') &&
		expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
		fg('platform_editor_breakout_resizing_hello_release')
	) {
		return CodeMirror.editorAttributes.of({
			class: getPos?.() === 0 ? 'first-node-in-document' : '',
		});
	} else {
		return [];
	}
};
