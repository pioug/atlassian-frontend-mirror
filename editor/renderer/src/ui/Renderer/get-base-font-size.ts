import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles';

import type { RendererAppearance, RendererContentMode } from './types';

export const getBaseFontSize = (
	appearance: RendererAppearance,
	contentMode: RendererContentMode,
): 13 | 14 | 16 => {
	if (contentMode === 'compact') {
		return akEditorFullPageDenseFontSize;
	}

	return appearance && appearance !== 'comment' ? akEditorFullPageDefaultFontSize : 14;
};
