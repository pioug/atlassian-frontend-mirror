import { akEditorFullWidthLayoutWidth, akEditorGutterPadding, akEditorGutterPaddingDynamic, akEditorGutterPaddingReduced, akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { EditorAppearance } from '../types';

/**
 * Calculate maximum width allowed for media single node in fix-width editor in new experience
 * @param containerWidth width of editor container
 */
export const calcMediaSingleMaxWidth = (
	containerWidth: number,
	editorAppearance?: EditorAppearance,
): number => {
	const fullPagePadding =
		editorAppearance === 'full-page' &&
		containerWidth <= akEditorFullPageNarrowBreakout &&
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
			? akEditorGutterPaddingReduced
			: akEditorGutterPaddingDynamic();

	const fullWidthPadding =
		editorAppearance === 'full-page' ? fullPagePadding * 2 : akEditorGutterPadding * 2;
	return Math.min(containerWidth - fullWidthPadding, akEditorFullWidthLayoutWidth);
};
