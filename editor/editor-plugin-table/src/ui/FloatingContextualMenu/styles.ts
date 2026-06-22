// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../../types';
import { contextualMenuDropdownWidthDnD } from '../consts';

export const cellColourPreviewStyles = (selectedColor: string): SerializedStyles =>
	css({
		'&::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			background: selectedColor,
		},
	});

export const tablePopupStyles =
	()// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	: SerializedStyles => css`
		.${ClassName.CONTEXTUAL_SUBMENU} {
			border-radius: ${token('radius.small', '3px')};
			background: ${token('elevation.surface.overlay')};
			box-shadow: ${token('elevation.shadow.overlay')};
			display: block;
			position: absolute;
			top: 0;
			left: ${contextualMenuDropdownWidthDnD}px;
			padding: ${token('space.100')};

			> div {
				padding: 0;
			}
		}

		.${ClassName.CONTEXTUAL_MENU_ICON_SMALL} {
			display: flex;

			&::before {
				content: '';
				display: block;
				border: 1px solid ${tableBackgroundBorderColor};
				border-radius: ${token('radius.small', '3px')};
				width: 14px;
				height: 14px;
			}

			&::after {
				content: '›';
				margin-left: ${token('space.050')};
				line-height: 14px;
				color: ${token('color.icon')};
			}
		}
	`;
