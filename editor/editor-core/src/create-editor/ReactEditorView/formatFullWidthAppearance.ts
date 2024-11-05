import { FULL_WIDTH_MODE } from '@atlaskit/editor-common/analytics';

import type { EditorAppearance } from '../../types';

export const formatFullWidthAppearance = (
	appearance: EditorAppearance | undefined,
): FULL_WIDTH_MODE => {
	if (appearance === 'full-width') {
		return FULL_WIDTH_MODE.FULL_WIDTH;
	}
	return FULL_WIDTH_MODE.FIXED_WIDTH;
};
