import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { RendererAppearance, RendererContentMode } from './types';

export const getBaseFontSize = (
	appearance: RendererAppearance,
	contentMode: RendererContentMode,
) => {
	if (expValEquals('cc_editor_ai_content_mode', 'variant', 'test')) {
		if (contentMode === 'dense') {
			const baseFontSize = expVal('cc_editor_ai_content_mode', 'baseFontSize', 13);

			return baseFontSize;
		}
	}

	return appearance && appearance !== 'comment' ? akEditorFullPageDefaultFontSize : 14;
};
