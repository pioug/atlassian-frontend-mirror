// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { hideNativeBrowserTextSelectionStyles } from '@atlaskit/editor-shared-styles/selection';
import { borderRadius } from '@atlaskit/media-ui/mixins';
import { token } from '@atlaskit/tokens';

import { fixedActionBarStyles, actionsBarClassName } from '../actionsBar/styles';
import { fixedBlanketStyles, blanketClassName } from '../blanket/styles';
import { generateResponsiveStyles } from '../generateResponsiveStyles';
import { getClickablePlayButtonStyles } from '../getClickablePlayButtonStyles';
import { getCursorStyle } from '../getCursorStyle';
import { getSelectableTickBoxStyles } from '../getSelectableTickBoxStyles';
import { getWrapperDimensions } from '../getWrapperDimensions';
import { getWrapperShadow } from '../getWrapperShadow';
import { transition } from '../transition';
import { type WrapperProps } from './types';

export const wrapperStyles: {
	({
		breakpoint,
		dimensions,
		appearance,
		disableOverlay,
		displayBackground,
		selected,
		isPlayButtonClickable,
		isTickBoxSelectable,
		shouldDisplayTooltip,
		mediaCardCursor,
	}: WrapperProps): SerializedStyles;
	displayName: string;
} = ({
	breakpoint,
	dimensions,
	appearance,
	disableOverlay,
	displayBackground,
	selected,
	isPlayButtonClickable,
	isTickBoxSelectable,
	shouldDisplayTooltip,
	mediaCardCursor,
}: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
WrapperProps): SerializedStyles => css`
	${transition()}
	box-sizing: border-box;
	* {
		box-sizing: border-box;
	}
	position: relative;
	font-family: ${token('font.family.body')};
	${getWrapperDimensions(dimensions, appearance)}
	${displayBackground && `background: ${token('color.background.neutral')};`}
  ${borderRadius}
  ${getCursorStyle(mediaCardCursor)}
  ${getWrapperShadow(disableOverlay, selected)}
  ${generateResponsiveStyles(breakpoint)};
	${selected ? hideNativeBrowserTextSelectionStyles : ''}

	/* We use classnames from here exceptionally to be able to handle styles when the Card is on hover */
  ${getClickablePlayButtonStyles(isPlayButtonClickable)}
  ${getSelectableTickBoxStyles(isTickBoxSelectable)}
  &:hover .${blanketClassName} {
		${fixedBlanketStyles}
	}
	&:hover .${actionsBarClassName}, &:focus-within .${actionsBarClassName} {
		${fixedActionBarStyles}
	}

	/* Tooltip does not support percentage dimensions. We enforce them here.
	   Guard skips top-layer elements (eg tooltip, modal); ':where()' keeps specificity unchanged. */
	${shouldDisplayTooltip && `> div:not(:where([popover], dialog)) { width: 100%; height: 100%; }`}

	button:focus + & {
		outline: solid 2px ${token('color.border.focused')};
	}
`;

wrapperStyles.displayName = 'NewFileExperienceWrapper';
