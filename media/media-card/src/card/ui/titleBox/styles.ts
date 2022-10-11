import { css } from '@emotion/react';
import { responsiveSettings, getTitleBoxHeight, Breakpoint } from '../common';
import { N0 } from '@atlaskit/theme/colors';
import { rgba } from '../../styles/mixins';
import {
  TitleBoxFooterProps,
  TitleBoxHeaderProps,
  TitleBoxWrapperProps,
} from './types';

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
export const titleBoxWrapperStyles = ({
  breakpoint,
  titleBoxBgColor,
}: TitleBoxWrapperProps) => css`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${rgba(
    titleBoxBgColor && HEX_REGEX.test(titleBoxBgColor) ? titleBoxBgColor : N0,
    0.8,
  )};
  color: inherit;
  cursor: inherit;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${generateResponsiveStyles(breakpoint)}
`;

titleBoxWrapperStyles.displayName = 'TitleBoxWrapper';

const infoStyles = `white-space: nowrap;
  overflow: hidden;`;

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
