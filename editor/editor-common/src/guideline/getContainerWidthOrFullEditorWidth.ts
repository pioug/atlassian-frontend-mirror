import { akEditorFullWidthLayoutWidth, akEditorGutterPaddingDynamic, akEditorGutterPaddingReduced, akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

/**
 * Calculates container or full editor width taking in account editor full width layout
 * width and editor gutter padding.
 */
export const getContainerWidthOrFullEditorWidth = (containerWidth: number): number => {
	const padding =
		containerWidth <= akEditorFullPageNarrowBreakout &&
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
			? akEditorGutterPaddingReduced
			: akEditorGutterPaddingDynamic();

	return Math.min(containerWidth - padding * 2, akEditorFullWidthLayoutWidth) / 2;
};
