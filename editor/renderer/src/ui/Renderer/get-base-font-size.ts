import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import type { RendererAppearance } from './types';

export const getBaseFontSize = (appearance: RendererAppearance) => {
	return appearance && appearance !== 'comment' ? akEditorFullPageDefaultFontSize : 14;
};
