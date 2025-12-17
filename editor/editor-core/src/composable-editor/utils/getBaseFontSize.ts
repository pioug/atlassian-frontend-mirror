import type { EditorAppearance, EditorContentMode } from '@atlaskit/editor-common/types';
import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * @param appearance
 * @returns default font size if valid
 */
export function getBaseFontSize(
	appearance?: EditorAppearance,
	contentMode?: EditorContentMode,
): number | undefined {
	if (
		expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
		expValEquals('cc_editor_ai_content_mode', 'variant', 'test')
	) {
		if (contentMode === 'compact') {
			return akEditorFullPageDenseFontSize;
		}
	}

	if (appearance === undefined) {
		return akEditorFullPageDefaultFontSize;
	}
	return !['comment', 'chromeless'].includes(appearance)
		? akEditorFullPageDefaultFontSize
		: undefined;
}
