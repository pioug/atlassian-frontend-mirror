import type {
	EditorAppearance,
	EditorContentMode,
} from '@atlaskit/editor-common/types/editor-appearance';
import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles/constants';

/**
 * @param appearance
 * @returns default font size if valid
 */
export function getBaseFontSize(
	appearance?: EditorAppearance,
	contentMode?: EditorContentMode,
): number | undefined {
	if (contentMode === 'compact') {
		return akEditorFullPageDenseFontSize;
	}

	if (appearance === undefined) {
		return akEditorFullPageDefaultFontSize;
	}
	return !['comment', 'chromeless'].includes(appearance)
		? akEditorFullPageDefaultFontSize
		: undefined;
}
