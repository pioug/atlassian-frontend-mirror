import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { RendererAppearance, RendererContentMode } from './types';

export const getBaseFontSize = (
	appearance: RendererAppearance,
	contentMode: RendererContentMode,
): 13 | 14 | 16 => {
	if (
		expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
		expValEquals('cc_editor_ai_content_mode', 'variant', 'test')
	) {
		if (contentMode === 'compact') {
			return akEditorFullPageDenseFontSize;
		}
	}

	return appearance && appearance !== 'comment' ? akEditorFullPageDefaultFontSize : 14;
};
