// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../../types';
import {
	dragMenuDropdownWidth,
	TABLE_DRAG_MENU_MENU_GROUP_BEFORE_HEIGHT,
	TABLE_DRAG_MENU_PADDING_TOP,
	TABLE_DRAG_MENU_SORT_GROUP_HEIGHT,
} from '../consts';

export const cellColourPreviewStyles = (selectedColor: string) =>
	css({
		'&::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			background: selectedColor,
		},
	});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const dragMenuBackgroundColorStyles = () => css`
	.${ClassName.DRAG_SUBMENU} {
		border-radius: ${token('radius.small', '3px')};
		background: ${token('elevation.surface.overlay')};
		box-shadow: ${token('elevation.shadow.overlay')};
		display: block;
		position: absolute;
		top: ${TABLE_DRAG_MENU_PADDING_TOP +
		TABLE_DRAG_MENU_SORT_GROUP_HEIGHT +
		TABLE_DRAG_MENU_MENU_GROUP_BEFORE_HEIGHT}px; /* move the submenu down when 'sort increasing/decreasing' appear before background color picker */
		left: ${dragMenuDropdownWidth}px;
		padding: ${token('space.100')};

		> div {
			padding: 0;
		}
	}

	.${ClassName.DRAG_SUBMENU_ICON} {
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const toggleStyles: SerializedStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"input[type='checkbox']": {
		width: '30px',
		height: '14px',
		pointerEvents: 'initial',
		cursor: 'pointer',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> label': {
		margin: '0px',
		pointerEvents: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			pointerEvents: 'none',
		},
	},
});
