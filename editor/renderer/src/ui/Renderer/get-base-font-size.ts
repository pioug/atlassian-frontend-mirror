import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { RendererAppearance, RendererContentMode } from './types';

export const getBaseFontSize = (
	appearance: RendererAppearance,
	contentMode: RendererContentMode,
) => {
	if (expValEquals('cc_editor_ai_content_mode', 'variant', 'test')) {
		if (
			contentMode ===
			(expValEquals('confluence_content_mode_replace_dense_with_compact', 'cohort', 'test')
				? 'compact'
				: 'dense')
		) {
			return akEditorFullPageDenseFontSize;
		}
	}

	return appearance && appearance !== 'comment' ? akEditorFullPageDefaultFontSize : 14;
};
