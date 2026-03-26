/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation*/
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { DEFAULT_BORDER_COLOR } from '@atlaskit/editor-common/ui-color';
import { token } from '@atlaskit/tokens';

// menuItemDimensions and itemSpacing are copied from
// packages/editor/editor-core/src/plugins/floating-toolbar/ui/DropdownMenu.tsx

export const menuItemDimensions = {
	width: 175,
	height: 32,
};

// itemSpacing is used in calculations expecting a number, hence not using a space token
export const itemSpacing = 4;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contextualMenuArrow: SerializedStyles = css`
	display: flex;
	&::after {
		content: '›';
		margin-left: ${token('space.050')};
		line-height: 20px;
		color: ${token('color.icon')};
	}
`;

export const contextualMenuColorIcon = (color?: string): SerializedStyles => css`
	${contextualMenuArrow}
	&::before {
		content: '';
		display: block;
		border: ${token('border.width')} solid ${DEFAULT_BORDER_COLOR};
		border-radius: ${token('radius.small', '3px')};
		width: 20px;
		height: 20px;
		${color && `background: ${color}`}
	}
`;

export const contextualSubMenu = (index: number): SerializedStyles => css`
	border-radius: ${token('radius.small', '3px')};
	background: ${token('elevation.surface.overlay')};
	box-shadow: ${token('elevation.shadow.overlay')};
	display: flex;
	position: absolute;
	top: ${index * (menuItemDimensions.height + itemSpacing * 2)}px;
	left: ${menuItemDimensions.width}px;
	padding: ${token('space.100')};

	> div {
		padding: 0;
	}
`;

export const buttonStyle = (selected: boolean): SerializedStyles => css`
	height: 26px;
	width: 26px;
	padding: 0;
	border-radius: ${token('radius.small')};
	background-color: ${selected ? token('color.text') : token('color.background.neutral')};
	border: 1px solid ${DEFAULT_BORDER_COLOR};
	cursor: pointer;
	display: block;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const buttonWrapperStyle: SerializedStyles = css`
	border: 1px solid transparent;
	margin: ${token('space.025')};
	font-size: 0;
	display: flex;
	align-items: center;
	padding: ${token('space.025')};
	border-radius: ${token('radius.medium')};
	&:focus-within,
	&:focus,
	&:hover {
		border-color: ${token('color.border')} !important;
	}
`;

export const line = (size: number, selected: boolean): SerializedStyles => css`
	position: relative;
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 12px;
		height: ${size}px;
		background-color: ${selected ? token('color.icon.inverse') : token('color.icon')};
		border-radius: 90px;
		transform: translate(-50%, -50%) rotate(135deg);
	}
`;

const getHoverStyles = (selector: string) =>
	`&:hover ${selector} {
    background: ${token('color.background.neutral.subtle.hovered')};

    &:hover {
      background: ${token('color.background.neutral.hovered')};
    }
  }`;

export const toolbarButtonWrapper = ({
	enabled,
	isOpen,
}: {
	enabled: boolean;
	isOpen: boolean;
}): SerializedStyles => css`
	display: flex;
	.image-border-toolbar-btn {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		padding: 0;
		& > span {
			margin: 0;
		}
		&:not([disabled])::after {
			border: none;
		}
	}
	.image-border-toolbar-dropdown {
		padding: 0;
		& > span {
			margin: 0;
		}
		width: 16px !important;
		border-top-left-radius: 0 !important;
		border-bottom-left-radius: 0 !important;
		margin-left: ${token('space.025')};
		&:not([disabled])::after {
			border: none;
		}
	}

	${!enabled && getHoverStyles('.image-border-toolbar-btn')}
	${!isOpen && !enabled && getHoverStyles('.image-border-toolbar-dropdown')}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const dropdownOptionButton: SerializedStyles = css`
	background: transparent;
	border: ${token('border.width.focused')} solid transparent;
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
	padding: 8px 16px;

	&:focus {
		background-color: ${token('color.background.neutral.subtle.hovered')};
		border: ${token('border.width.focused')} solid ${token('color.border.focused')};
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const dropdownWrapper: SerializedStyles = css`
	span[role='menuitem'] {
		padding: 0;
	}
`;
