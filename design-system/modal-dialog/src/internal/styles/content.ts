import { css } from '@emotion/core';
import styled from '@emotion/styled';

import {
  actionMargin,
  dangerColor,
  keylineHeight,
  modalPadding,
  titleMargin,
  warningColor,
} from '../constants';
import { AppearanceType } from '../types';

// Wrapper
// ==============================

export const wrapperStyles = css`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-height: 100%;
  /* necessary to fix overflow issue in Safari 14.0.3 */
  min-height: 0;
`;

// Header
// ==============================
export interface HeaderProps {
  /**
   * When `true` it will show the keyline below the header.
   */
  showKeyline?: boolean;
}

export const headerStyles = css`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  position: relative;
  padding: ${modalPadding}px ${modalPadding}px ${modalPadding - keylineHeight}px
    ${modalPadding}px;
`;

// TODO: This is a public API, so should remove during breaking change later.
export const Header = styled.header<HeaderProps>`
  ${headerStyles}
`;

export const titleStyles = css`
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

// TODO: This is a public API, so should remove during breaking change later.
export const Title = styled.h1`
  ${titleStyles};
`;

export interface TitleTextProps {
  /**
   * When `true` will enable the heading to span multiple lines if it is long enough.
   */
  isHeadingMultiline?: boolean;
}

export const getTitleTextStyles = (isHeadingMultiline?: boolean) => css`
  flex: 1 1 auto;
  min-width: 0;
  word-wrap: break-word;
  width: 100%;

  ${isHeadingMultiline !== true &&
  css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `};
`;

type iconColorType = { [key in AppearanceType]: string };
const iconColor: iconColorType = {
  danger: dangerColor,
  warning: warningColor,
};

export const getTitleIconStyles = (appearance: AppearanceType) => css`
  color: ${iconColor[appearance]};
  margin-right: ${titleMargin}px;
  flex: 0 0 auto;
`;

// Body
// ==============================
export interface BodyProps {
  /**
   * Class name passed to the component.
   */
  className?: string;
}

/**
  Adding the padding here avoids cropping the keyline on its sides.
  The combined vertical spacing is maintained by subtracting the
  keyline height from header and footer.
*/

export const bodyStyles = css`
  flex: 1 1 auto;
  padding: ${keylineHeight}px ${modalPadding}px;
`;

// TODO: This is a public API, so should remove during breaking change later.
export const Body = styled.div`
  ${bodyStyles};
`;

// Footer
// ==============================
export interface FooterProps {
  /**
   * When `true` it will show the keyline above the footer.
   */
  showKeyline?: boolean;
}

export const footerStyles = css`
  position: relative;
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  padding: ${modalPadding - keylineHeight}px ${modalPadding}px ${modalPadding}px
    ${modalPadding}px;
`;

// TODO: This is a public API, so should remove during breaking change later.
export const Footer = styled.footer<FooterProps>`
  ${footerStyles};
`;

export const actionWrapperStyles = css`
  display: inline-flex;
  margin: 0 -${actionMargin}px;
`;

export const actionItemStyles = css`
  flex: 1 0 auto;
  margin: 0 ${actionMargin}px;
`;
