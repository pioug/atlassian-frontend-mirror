// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
	akEditorDeleteBorder,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const dateStyles = css`
	.${DateSharedCssClassName.DATE_CONTAINER} {
		.${DateSharedCssClassName.DATE_WRAPPER} {
			line-height: initial;
			cursor: pointer;
		}

		&.${akEditorSelectedNodeClassName} {
			.${DateSharedCssClassName.DATE_WRAPPER} > span {
				${getSelectionStyles([SelectionStyle.BoxShadow])}
			}
		}
	}

	.danger {
		.${DateSharedCssClassName.DATE_CONTAINER}.${akEditorSelectedNodeClassName}
			.${DateSharedCssClassName.DATE_WRAPPER}
			> span {
			box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
				${token('color.border.danger', akEditorDeleteBorder)};
		}
	}
`;
