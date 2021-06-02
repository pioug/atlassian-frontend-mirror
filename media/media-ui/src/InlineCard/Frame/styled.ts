import { AnchorHTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { B100, B400, B50, N20 } from '@atlaskit/theme/colors';
import { borderRadius as akBorderRadius } from '@atlaskit/theme/constants';
import { e100 } from '@atlaskit/theme/elevation';
import { themed } from '@atlaskit/theme/components';
import { TitleWrapper } from '../IconAndTitleLayout/styled';

export interface WrapperProps {
  isSelected?: boolean;
  isInteractive?: boolean;
  withoutHover?: boolean;
  withoutBackground?: boolean;
}

const BACKGROUND_COLOR_DARK = '#262B31';

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
        background-color: ${themed({
          light: N20,
          dark: BACKGROUND_COLOR_DARK,
        })};
        text-decoration: none;
      }
      :active {
        background-color: ${themed({
          light: B50,
          dark: BACKGROUND_COLOR_DARK,
        })};
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

const isSelected = ({ isSelected }: WrapperProps) => {
  if (isSelected) {
    return selected;
  } else {
    return 'user-select: text';
  }
};

const withoutHover = ({ withoutHover }: WrapperProps) => {
  return withoutHover
    ? `
    &:hover {
      text-decoration: none;
    }
  `
    : '';
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
export const Wrapper: ComponentClass<
  AnchorHTMLAttributes<{}> & WrapperProps
> = styled.a`
  line-height: 16px;
  padding: 1px 0.24em 2px 0.24em;
  ${(props) =>
    props.withoutBackground ? `padding-left: 0; margin-left:-2px;` : ''}
  display: inline;
  box-decoration-break: clone;
  border-radius: ${akBorderRadius()}px;
  color: ${themed({ light: B400, dark: '#4794FF' })};
  background-color: ${(props) =>
    props.withoutBackground
      ? ''
      : themed({ light: 'white', dark: BACKGROUND_COLOR_DARK })};
  ${(props) => (props.withoutBackground ? '' : e100())};
  ${isInteractive}
  ${isSelected};
  ${withoutHover}
  transition: 0.1s all ease-in-out;
  -moz-user-select: none;

  &:hover ${TitleWrapper} {
    text-decoration: ${({ withoutHover }) =>
      withoutHover ? 'none' : 'underline'};
  }
`;
