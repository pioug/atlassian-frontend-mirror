import { css } from '@emotion/react';

import { fontFamily } from '@atlaskit/theme/constants';
import { borderRadius } from '@atlaskit/media-ui';
import { N20, B100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { hideNativeBrowserTextSelectionStyles } from '@atlaskit/editor-shared-styles/selection';

import { transition } from '../styles';
import { fixedBlanketStyles, blanketClassName } from '../blanket/styles';
import { fixedActionBarStyles, actionsBarClassName } from '../actionsBar/styles';
import {
	generateResponsiveStyles,
	getClickablePlayButtonStyles,
	getCursorStyle,
	getSelectableTickBoxStyles,
	getWrapperDimensions,
	getWrapperShadow,
} from '../styles';
import { type WrapperProps } from './types';

export const wrapperStyles = ({
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
WrapperProps) => css`
	${transition()}
	box-sizing: border-box;
	* {
		box-sizing: border-box;
	}
	position: relative;
	font-family: ${fontFamily()};
	${getWrapperDimensions(dimensions, appearance)}
	${displayBackground && `background: ${token('color.background.neutral', N20)};`}
  ${borderRadius}
  ${getCursorStyle(mediaCardCursor)}
  ${getWrapperShadow(disableOverlay, selected)}
  ${generateResponsiveStyles(breakpoint)};
	${hideNativeBrowserTextSelectionStyles}

	/* We use classnames from here exceptionally to be able to handle styles when the Card is on hover */
  ${getClickablePlayButtonStyles(isPlayButtonClickable)}
  ${getSelectableTickBoxStyles(isTickBoxSelectable)}
  &:hover .${blanketClassName} {
		${fixedBlanketStyles}
	}
	&:hover .${actionsBarClassName}, &:focus-within .${actionsBarClassName} {
		${fixedActionBarStyles}
	}

	/* Tooltip does not support percentage dimensions. We enforce them here */
	${shouldDisplayTooltip && `> div { width: 100%; height: 100%; }`}

	button:focus + & {
		outline: solid 2px ${token('color.border.focused', B100)};
	}
`;

wrapperStyles.displayName = 'NewFileExperienceWrapper';
