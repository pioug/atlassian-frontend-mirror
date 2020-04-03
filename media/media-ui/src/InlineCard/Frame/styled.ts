import { AnchorHTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { B100, N20, B50 } from '@atlaskit/theme/colors';
import { borderRadius as akBorderRadius } from '@atlaskit/theme/constants';
import { e100 } from '@atlaskit/theme/elevation';

export interface WrapperProps {
  isSelected?: boolean;
  isInteractive?: boolean;
  withoutBackground?: boolean;
}

const selected = `
  cursor: pointer;
  box-shadow: 0 0 0 2px ${B100};
  outline: none;
  user-select: none;
  &, :hover, :focus, :active {
    text-decoration: none;
  }
`;

const isInteractive = ({ isInteractive }: WrapperProps) => {
  if (isInteractive) {
    return `
      cursor: pointer;
      :hover {
        background-color: ${N20};
        text-decoration: none;
      }
      :active {
        background-color: ${B50};
        text-decoration: none;
      }
      :focus {
        ${selected}
        text-decoration: none;
      }
    `;
  } else {
    return '';
  }
};

const background = ({ withoutBackground }: WrapperProps) => {
  return withoutBackground
    ? ``
    : `
    background-color: white; 
    ${e100()}
  `;
};

const isSelected = ({ isSelected }: WrapperProps) => {
  if (isSelected) {
    return selected;
  } else {
    return 'user-select: text';
  }
};

/* 
  Inline smart cards should have the following layout:
  ------------------------------------
  | icon | title | action OR lozenge |
  ------------------------------------
  The aim is to ensure (1) all children are
  in line with each other, (2) are vertically
  centered.
*/
// NB: `padding` consistent with @mentions.
// NB: `display: inline` required for `box-decoration-break` to work.
// NB: `box-decoration-break` required for retaining properties (border-radius) on wrap.
export const Wrapper: ComponentClass<AnchorHTMLAttributes<{}> &
  WrapperProps> = styled.a`
  line-height: 16px;
  padding: 1px 0.24em 2px 0.24em;
  display: inline;
  box-decoration-break: clone;
  border-radius: ${akBorderRadius()}px;
  ${background};
  ${isInteractive}
  ${isSelected};
  transition: 0.1s all ease-in-out;
`;
