import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { B100, N30A, N40A, text } from '@atlaskit/theme/colors';
import { borderRadius as akBorderRadius } from '@atlaskit/theme/constants';
import { themed } from '@atlaskit/theme/components';

export interface WrapperProps {
  isSelected?: boolean;
}

const FONT_COLOR = text;
// TODO: Dark mode background color to be added in the future.
const BACKGROUND_COLOR_LIGHT = N30A;

const selected = `
  cursor: pointer;
  box-shadow: 0 0 0 2px ${B100};
  outline: none;
  user-select: none;
  &, :hover, :focus, :active {
    text-decoration: none;
  }
`;

const isSelected = ({ isSelected }: WrapperProps) => {
  if (isSelected) {
    return selected;
  } else {
    return 'user-select: text';
  }
};

/*
  Media Inline cards should have the following layout:
  -----------------
  | icon | title |
  -----------------
  The aim is to ensure (1) all children are
  in line with each other, (2) are vertically
  centered.
*/
// NB: `padding` consistent with @mentions.
// NB: `display: inline` required for `box-decoration-break` to work.
// NB: `box-decoration-break` required for retaining properties (border-radius) on wrap.
export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.span`
  line-height: 16px;
  padding: 0px 0.3em 2px 0.23em;
  box-decoration-break: clone;
  display: inline;
  border-radius: ${akBorderRadius()}px;
  color: ${FONT_COLOR};
  background-color: ${themed({
    light: BACKGROUND_COLOR_LIGHT,
  })};
  ${isSelected};
  transition: 0.1s all ease-in-out;
  -moz-user-select: none;
  cursor: pointer;

  &:hover {
    background-color: ${N40A};
  }
`;
