import { css } from '@emotion/core';
import styled from '@emotion/styled';

import type { HeaderComponentProps } from '../components/header';
import {
  actionMargin,
  dangerColor,
  keylineHeight,
  modalPadding,
  titleMargin,
  warningColor,
} from '../constants';
import type { AppearanceType } from '../types';

// Wrapper
// ==============================

export const wrapperStyles = css`
  display: flex;
  flex-direction: column;

  /**
  * This ensures that the element fills the whole modal dialog space
  * and its content does not overflow (since flex items don't
  * shrink past its content size by default). */
  flex: 1 1 auto;
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
  display: flex;
  align-items: center;
  justify-content: space-between;

  position: relative;
  padding: ${modalPadding}px;
  padding-bottom: ${modalPadding - keylineHeight}px;
`;

// TODO: This is a public API, so should remove during breaking change later.
export const Header = styled.div<HeaderProps>`
  ${headerStyles}
`;

export const titleStyles = css`
  display: flex;
  align-items: center;

  font-size: 20px;
  font-style: inherit;
  font-weight: 500;
  letter-spacing: -0.008em;
  line-height: 1;

  min-width: 0;
  margin: 0;
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

/** 20 = font size, 1.2 = adjusted line height.
 * When the heading is truncated (not multi-line), we adjust the
 * line height to avoid cropping the descenders. This removes
 * the extra spacing that we get from that adjustment.
 */
const lineHeightOffset = 20 - 20 * 1.2;

export const getTitleTextStyles = (isHeadingMultiline?: boolean) => css`
  word-wrap: break-word;

  /**
  * This ensures that the element fills the whole header space
  * and its content does not overflow (since flex items don't
  * shrink past its content size by default). */
  flex: 1 1 auto;
  min-width: 0;

  ${isHeadingMultiline !== true &&
  css`
    line-height: 1.2;
    margin-top: ${lineHeightOffset / 2}px;
    margin-bottom: ${lineHeightOffset / 2}px;

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

export const getTitleIconStyles = ({
  appearance,
  isHeadingMultiline,
}: Required<
  Pick<HeaderComponentProps, 'appearance' | 'isHeadingMultiline'>
>) => css`
  flex: 0 0 auto; // Keeps the size of the icon the same, in case the text element grows in width.
  color: ${iconColor[appearance]};
  margin-right: ${titleMargin}px;

  ${isHeadingMultiline !== true &&
  css`
    line-height: 1.2;
    margin-bottom: ${lineHeightOffset / 2}px;
  `};
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
 * Adding the padding here avoids cropping the keyline on its sides.
 * The combined vertical spacing is maintained by subtracting the
 * keyline height from header and footer.
 */
export const bodyStyles = css`
  flex: 1 1 auto; // Ensures the body fills the whole space between header and footer.
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

const baseFooterStyles = css`
  display: flex;
  align-items: center;

  position: relative;
  padding: ${modalPadding}px;
  padding-top: ${modalPadding - keylineHeight}px;

  & [data-ds--modal-dialog--action] {
    margin-left: ${actionMargin}px;
  }
`;

/** This is the styles we use in our public Footer component,
 *  used when users build their own custom footer. */
const externalFooterStyles = css`
  ${baseFooterStyles}

  /**
   * Some of our users rely on this behavior
   * to put actions on the left-hand side.
   * e.g. https://atlaskit.atlassian.com/examples/editor/editor-core/full-page-with-x-extensions
   * (Click '+' -> 'View more' to see the element browser in a modal).
   */
  justify-content: space-between;
`;

/** This is the styles we use in our internal Footer component,
 *  used when users opt into our default footer + actions API. */
export const internalFooterStyles = css`
  ${baseFooterStyles}

  /**
  * When we're /not/ using a custom footer, we place
  * all actions on the right-hand side by default.
  */
  justify-content: flex-end;
`;

// TODO: This is a public API, so should remove during breaking change later.
export const Footer = styled.div<FooterProps>`
  ${externalFooterStyles};
`;
