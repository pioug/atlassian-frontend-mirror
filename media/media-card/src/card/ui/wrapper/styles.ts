import { css } from '@emotion/react';

import { fontFamily } from '@atlaskit/theme/constants';
import { borderRadius } from '@atlaskit/media-ui';
import { N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { hideNativeBrowserTextSelectionStyles } from '@atlaskit/editor-shared-styles/selection';
import { themed } from '@atlaskit/theme/components';

import { transition } from '../styles';
import { fixedBlanketStyles, blanketClassName } from '../blanket/styles';
import {
  fixedActionBarStyles,
  actionsBarClassName,
} from '../actionsBar/styles';
import {
  generateResponsiveStyles,
  getClickablePlayButtonStyles,
  getCursorStyle,
  getSelectableTickBoxStyles,
  getWrapperDimensions,
  getWrapperShadow,
} from '../styles';
import { WrapperProps } from './types';

const BACKGROUND_COLOR_DARK = '#22272C';

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
  theme,
}: WrapperProps) => css`
  ${transition()}
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  position: relative;
  font-family: ${fontFamily()};
  ${getWrapperDimensions(dimensions, appearance)}
  ${displayBackground &&
  `background: ${themed({
    light: token('color.background.neutral', N20),
    dark: token('color.background.neutral', BACKGROUND_COLOR_DARK),
  })({ theme })};`}
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
  &:hover .${actionsBarClassName} {
    ${fixedActionBarStyles}
  }

  /* Tooltip does not support percentage dimensions. We enforce them here */
  ${shouldDisplayTooltip && `> div { width: 100%; height: 100%; }`}
`;

wrapperStyles.displayName = 'NewFileExperienceWrapper';
