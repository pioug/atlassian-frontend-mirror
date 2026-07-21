import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	akEditorCalculatedWideLayoutWidth,
	akEditorDefaultLayoutWidth,
	akEditorFullPageNarrowBreakout,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorMaxLayoutWidth,
} from '@atlaskit/editor-shared-styles/constants';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BreakoutPlugin } from '../breakoutPluginType';

const WIDTHS: {
	FULL: number;
	MAX: number;
	MIN: number;
	WIDE: number;
} = {
	FULL: akEditorFullWidthLayoutWidth,
	MAX: akEditorMaxLayoutWidth,
	MIN: akEditorDefaultLayoutWidth,
	WIDE: akEditorCalculatedWideLayoutWidth,
};

export { WIDTHS };

export const getResizeContainerWidth = (
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined,
): number => {
	const editorWidth = api?.width.sharedState?.currentState()?.width ?? 0;
	const padding =
		editorWidth <= akEditorFullPageNarrowBreakout &&
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
			? akEditorGutterPaddingReduced
			: akEditorGutterPaddingDynamic();

	return editorWidth - 2 * padding - akEditorGutterPadding;
};

export const getResizeHardMax = (containerWidth: number): number => {
	return expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
		expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
		? Math.min(containerWidth, WIDTHS.MAX)
		: Math.min(containerWidth, WIDTHS.FULL);
};

export const clampWidthToResizeBounds = (proposedWidth: number, containerWidth: number): number => {
	return Math.max(WIDTHS.MIN, Math.min(proposedWidth, getResizeHardMax(containerWidth)));
};
