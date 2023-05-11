import styled, { css } from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { borderRadius, colors } from '@atlaskit/theme';
import { COLOR_CARD_SIZE } from '../constants';
import { token } from '@atlaskit/tokens';

type ColorCardProps = {
  focused?: boolean;
  isTabbing?: boolean;
};

const buttonFocusedBorder = `border-color: ${token(
  'color.border.focused',
  colors.B100,
)};`;

const sharedColorContainerStyles = css`
  display: inline-block;
  position: relative;
  width: ${COLOR_CARD_SIZE}px;
  height: ${COLOR_CARD_SIZE}px;
  border: 2px solid transparent;
  box-sizing: border-box;
  border-radius: ${borderRadius() * 2}px;
  transition: border-color 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
  background-color: transparent;
  border-color: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;
`;

export const ColorCardOption = styled.div<
  ColorCardProps & JSX.IntrinsicElements['div']
>`
  ${sharedColorContainerStyles};

  ${(props) => {
    if (props.isTabbing === undefined || props.isTabbing) {
      return `&:hover,
      &:focus {
        border-color: ${token('color.border.focused', colors.B75)};
      }`;
    }
  }}

  ${(props) => {
    if (props.focused && !props.isTabbing) {
      return `border-color: ${token('color.border.focused', colors.B75)}`;
    }
  }};
`;

export const ColorCardButton = styled.button<
  ColorCardProps & JSX.IntrinsicElements['button']
>`
  ${sharedColorContainerStyles};
  &:hover {
    border-color: transparent;
  }
  &:not(:focus):hover,
  &:focus {
    ${buttonFocusedBorder};
  }

  ${(props) => {
    if (props.focused) {
      return buttonFocusedBorder;
    }
  }};
`;

type ColorCardContentProps = {
  color: string;
};

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const ColorCardContent = styled.div<ColorCardContentProps>`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 24px;
  height: 24px;
  border-radius: ${borderRadius()}px;
  background: ${(props) => props.color};
  box-shadow: inset 0px 0px 0px 1px
    ${token('color.background.inverse.subtle', colors.DN600A)};
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const ColorCardContentCheckMark = styled.div`
  margin: 1px;
`;
