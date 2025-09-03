// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { N60A, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../../types';
import { contextualMenuDropdownWidth, contextualMenuDropdownWidthDnD } from '../consts';

export const cellColourPreviewStyles = (selectedColor: string) =>
	css({
		'&::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			background: selectedColor,
		},
	});

export const tablePopupStyles = (
	isDragAndDropEnabled: boolean | undefined,
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
) => css`
	.${ClassName.CONTEXTUAL_SUBMENU} {
		border-radius: ${token('radius.small', '3px')};
		background: ${token('elevation.surface.overlay', 'white')};
		box-shadow: ${token('elevation.shadow.overlay', `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`)};
		display: block;
		position: absolute;
		top: 0;
		left: ${isDragAndDropEnabled ? contextualMenuDropdownWidthDnD : contextualMenuDropdownWidth}px;
		padding: ${token('space.100', '8px')};

		> div {
			padding: 0;
		}
	}

	.${ClassName.CONTEXTUAL_MENU_ICON} {
		display: flex;

		&::before {
			content: '';
			display: block;
			border: 1px solid ${tableBackgroundBorderColor};
			border-radius: ${token('radius.small', '3px')};
			width: 20px;
			height: 20px;
		}

		&::after {
			content: '›';
			margin-left: ${token('space.050', '4px')};
			line-height: 20px;
			color: ${token('color.icon', N90)};
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
			margin-left: ${token('space.050', '4px')};
			line-height: 14px;
			color: ${token('color.icon', N90)};
		}
	}
`;
