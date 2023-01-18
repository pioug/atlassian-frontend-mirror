import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { responsiveSettings, getTitleBoxHeight, Breakpoint } from '../common';
import { N0, N800 } from '@atlaskit/theme/colors';
import { rgba } from '../../styles/mixins';
import {
  TitleBoxFooterProps,
  TitleBoxHeaderProps,
  TitleBoxWrapperProps,
} from './types';

import { themed } from '@atlaskit/theme/components';

const generateResponsiveStyles = (
  breakpoint: Breakpoint = Breakpoint.SMALL,
) => {
  const setting = responsiveSettings[breakpoint];
  const verticalPadding = setting.titleBox.verticalPadding;
  const horizontalPadding = setting.titleBox.horizontalPadding;
  const height = getTitleBoxHeight(breakpoint);
  return `height: ${height}px;
    padding: ${verticalPadding}px ${horizontalPadding}px;`;
};

const HEX_REGEX = /^#[0-9A-F]{6}$/i;
const BACKGROUND_COLOR_DARK = '#161a1d';
const TEXT_COLOR_DARK = '#C7D1DB';

export const titleBoxWrapperStyles = ({
  breakpoint,
  titleBoxBgColor,
  theme,
}: TitleBoxWrapperProps) => css`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${themed({
    light: token(
      'elevation.surface',
      rgba(
        titleBoxBgColor && HEX_REGEX.test(titleBoxBgColor)
          ? titleBoxBgColor
          : N0,
        1,
      ),
    ),
    dark: token(
      'elevation.surface',
      rgba(
        // theme does not contain this color, use constant instead
        titleBoxBgColor && HEX_REGEX.test(titleBoxBgColor)
          ? titleBoxBgColor
          : BACKGROUND_COLOR_DARK,
        1,
      ),
    ),
  })({ theme })};
  color: ${themed({
    light: token('color.text', N800),
    dark: token('color.text', TEXT_COLOR_DARK),
  })({ theme })};
  cursor: inherit;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${generateResponsiveStyles(breakpoint)}
`;

titleBoxWrapperStyles.displayName = 'TitleBoxWrapper';

const infoStyles = `white-space: nowrap;overflow: hidden;`;

const iconOverlapStyles = `padding-right: 10px;`;

export const titleBoxHeaderStyles = ({
  hasIconOverlap,
}: TitleBoxHeaderProps) => css`
  font-weight: 600;
  ${infoStyles}
  ${hasIconOverlap && iconOverlapStyles}
`;

titleBoxHeaderStyles.displayName = 'FailedTitleBoxHeader';

export const titleBoxFooterStyles = ({
  hasIconOverlap,
}: TitleBoxFooterProps) => css`
  text-overflow: ellipsis;
  ${infoStyles}
  ${hasIconOverlap && iconOverlapStyles}
`;

titleBoxFooterStyles.displayName = 'TitleBoxFooter';

export const titleBoxIconStyles = css`
  position: absolute;
  right: 4px;
  bottom: 0px;
`;

export const errorMessageWrapperStyles = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  span {
    vertical-align: middle;
    :nth-child(2) {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
`;
