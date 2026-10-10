import { FULL_WIDTH_MODE } from '@atlaskit/editor-common/analytics/types/general-events';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';

export const formatFullWidthAppearance = (
	appearance: EditorAppearance | undefined,
): FULL_WIDTH_MODE => {
	if (appearance === 'full-width') {
		return FULL_WIDTH_MODE.FULL_WIDTH;
	}
	return FULL_WIDTH_MODE.FIXED_WIDTH;
};
