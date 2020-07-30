import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { DN30, N30, N800, R400, Y400 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { divide } from '@atlaskit/theme/math';

import { AppearanceType } from '../types';
import { flexMaxHeightIEFix } from '../utils/flex-max-height-ie-fix';

// Constants
// ==============================
const modalPadding = gridSize() * 3;
const keylineColor = themed({ light: N30, dark: DN30 });
export const keylineHeight = 2;

// Wrapper
// ==============================

export const wrapperStyles = css`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  ${flexMaxHeightIEFix};
`;

// Header
// ==============================
export interface HeaderProps {
  /**
   * When `true` it will show the keyline below the header.
   */
  showKeyline?: boolean;
}

export const Header = styled.header<HeaderProps>`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  transition: box-shadow 200ms;
  position: relative;
  padding: ${modalPadding}px ${modalPadding}px ${modalPadding - keylineHeight}px
    ${modalPadding}px;
  box-shadow: ${props =>
    props.showKeyline
      ? `0 ${keylineHeight}px 0 0 ${keylineColor(props)}`
      : 'none'};
`;

export const Title = styled.h4`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-style: inherit;
  font-weight: 500;
  letter-spacing: -0.008em;
  line-height: 1;
  margin: 0;
  min-width: 0;
`;

export interface TitleTextProps {
  /**
   * When `true` will enable the heading to span multiple lines if it is long enough.
   */
  isHeadingMultiline?: boolean;
}

export const TitleText = styled.span<TitleTextProps>`
  flex: 1 1 auto;
  min-width: 0;
  word-wrap: break-word;
  width: 100%;
  ${props =>
    !props.isHeadingMultiline &&
    `
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};
`;

type iconColorType = { [key in AppearanceType]: string };
const iconColor: iconColorType = {
  danger: R400,
  warning: Y400,
};

export const titleIconWrapperStyles = (appearance: AppearanceType) => css`
  color: ${iconColor[appearance]};
  margin-right: ${gridSize()}px;
  flex: 0 0 auto;
`;

// Body
// ==============================

/**
  Adding the padding here avoids cropping box shadow on first/last
  children. The combined vertical spacing is maintained by subtracting the
  keyline height from header and footer.
*/
export const bodyStyles = (shouldScroll?: boolean) => css`
  flex: 1 1 auto;
  ${shouldScroll
    ? `
        overflow-y: auto;
        overflow-x: hidden;
        padding: ${keylineHeight}px ${modalPadding}px;
      `
    : `
        padding: 0 ${modalPadding}px;
      `}
  @media (min-width: 320px) and (max-width: 480px) {
    overflow-y: auto;
    height: 100%;
  }
  &:focus {
    outline-offset: -1px;
    outline-style: dotted;
    outline-color: ${N800};
    outline-width: thin;
  }
`;

export interface BodyProps {
  /**
   * Tab index used to enable the component to receive focus.
   */
  tabIndex?: number;

  /**
   * Class name passed to the component.
   */
  className?: string;
}

export const Body = styled.div``;

// Footer
// ==============================
export interface FooterProps {
  /**
   * When `true` it will show the keyline above the footer.
   */
  showKeyline?: boolean;
}

export const Footer = styled.footer<FooterProps>`
  position: relative;
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  transition: box-shadow 200ms;
  padding: ${modalPadding - keylineHeight}px ${modalPadding}px ${modalPadding}px
    ${modalPadding}px;
  box-shadow: ${props =>
    props.showKeyline
      ? `0 -${keylineHeight}px 0 0 ${keylineColor(props)}`
      : 'none'};
`;

export const Actions = styled.div`
  display: inline-flex;
  margin: 0 -${divide(gridSize, 2)}px;
`;

export const ActionItem = styled.div`
  flex: 1 0 auto;
  margin: 0 ${divide(gridSize, 2)}px;
`;
