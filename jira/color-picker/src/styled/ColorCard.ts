import styled, { css } from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { borderRadius, colors } from '@atlaskit/theme';
import { COLOR_CARD_SIZE } from '../constants';

// polished has problems tree-shaking https://github.com/styled-components/polished/issues/478
import darken from 'polished/lib/color/darken';

type ColorCardProps = {
  focused?: boolean;
};

const buttonFocusedBorder = `border-color: ${colors.B100};`;

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
  &:hover,
  &:focus {
    border-color: ${colors.B75};
  }
`;

export const ColorCardOption = styled.div<
  ColorCardProps & JSX.IntrinsicElements['div']
>`
  ${sharedColorContainerStyles};

  ${(props) => {
    if (props.focused) {
      return `border-color: ${colors.B75}`;
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

export const ColorCardContent = styled.div<ColorCardContentProps>`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 22px;
  height: 22px;
  border-radius: ${borderRadius()}px;
  background: ${(props) => props.color};
  border: solid 1px ${(props) => darken(0.1, props.color)};
`;
