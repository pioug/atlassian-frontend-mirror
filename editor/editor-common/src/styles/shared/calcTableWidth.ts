import type { TableLayout } from '@atlaskit/adf-schema';
import {
	akEditorBreakoutPadding,
	akEditorFullWidthLayoutWidth,
	akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';

export const calcTableWidth = (
	layout: TableLayout,
	containerWidth?: number,
	addControllerPadding: boolean = true,
): number | 'inherit' => {
	switch (layout) {
		case 'full-width':
			return containerWidth
				? Math.min(
						containerWidth - (addControllerPadding ? akEditorBreakoutPadding : 0),
						akEditorFullWidthLayoutWidth,
					)
				: akEditorFullWidthLayoutWidth;
		case 'wide':
			if (containerWidth) {
				return Math.min(
					containerWidth - (addControllerPadding ? akEditorBreakoutPadding : 0),
					akEditorWideLayoutWidth,
				);
			}

			return akEditorWideLayoutWidth;
		default:
			return 'inherit';
	}
};
