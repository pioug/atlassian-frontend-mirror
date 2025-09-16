import type { EditorAppearance, EditorContentMode } from '@atlaskit/editor-common/types';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

/**
 * @param appearance
 * @returns default font size if valid
 */
export function getBaseFontSize(
	appearance?: EditorAppearance,
	contentMode?: EditorContentMode,
): number | undefined {
	if (expValEquals('cc_editor_ai_content_mode', 'variant', 'test')) {
		if (contentMode === 'dense') {
			const baseFontSize = expVal('cc_editor_ai_content_mode', 'baseFontSize', 13);

			return baseFontSize;
		}
	}

	if (appearance === undefined) {
		return akEditorFullPageDefaultFontSize;
	}
	return !['comment', 'chromeless'].includes(appearance)
		? akEditorFullPageDefaultFontSize
		: undefined;
}
