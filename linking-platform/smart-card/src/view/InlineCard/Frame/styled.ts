import styled from '@emotion/styled';
import {
  B100,
  B400,
  B50,
  DN40A,
  DN50A,
  N20,
  N40A,
  N50A,
} from '@atlaskit/theme/colors';
import { borderRadius as akBorderRadius } from '@atlaskit/theme/constants';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

export interface WrapperProps {
  href?: string;
  isSelected?: boolean;
  isInteractive?: boolean;
  withoutBackground?: boolean;
}

const BACKGROUND_COLOR_DARK = '#262B31';

const selected = `
  cursor: pointer;
  box-shadow: 0 0 0 2px ${token('color.border.selected', B100)};
  outline: none;
  user-select: none;
  &, :hover, :focus, :active {
    text-decoration: none;
  }
`;

const isInteractive = ({ isInteractive }: WrapperProps) => {
  if (isInteractive) {
    return `
      :hover {
        background-color: ${themed({
          light: token('color.background.neutral.subtle.hovered', N20),
          dark: token(
            'color.background.neutral.subtle.hovered',
            BACKGROUND_COLOR_DARK,
          ),
        })};
      }
      :active {
        background-color: ${themed({
          light: token('color.background.selected', B50),
          dark: token('color.background.selected', BACKGROUND_COLOR_DARK),
        })};
      }
      :focus {
        ${selected}
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
const baseWrapperStyle = (props: WrapperProps) => `
  line-height: 16px;
  padding: 1px 0.24em 2px 0.24em;
  ${props.withoutBackground ? `padding-left: 0; margin-left:-2px;` : ''}
  display: inline;
  box-decoration-break: clone;
  border-radius: ${akBorderRadius()}px;
  color: ${themed({
    light: token('color.link', B400),
    dark: token('color.link', '#4794FF'),
  })(props)};
  background-color: ${
    props.withoutBackground
      ? ''
      : themed({
          light: token('elevation.surface.raised', 'white'),
          dark: token('elevation.surface.raised', BACKGROUND_COLOR_DARK),
        })(props)
  };
  ${
    props.withoutBackground
      ? ''
      : themed({
          light: `box-shadow: ${token(
            'elevation.shadow.raised',
            `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`,
          )};`,
          dark: `box-shadow: ${token(
            'elevation.shadow.raised',
            `0 1px 1px ${DN50A}, 0 0 1px 1px ${DN40A}`,
          )};`,
        })(props)
  }
  ${isSelected(props)};
  transition: 0.1s all ease-in-out;
  -moz-user-select: none;
`;

export const WrapperAnchor = styled.a<WrapperProps>`
  ${baseWrapperStyle}
  ${isInteractive}
`;
WrapperAnchor.displayName = 'WrapperAnchor';

export const WrapperSpan = styled.span<WrapperProps>`
  ${baseWrapperStyle}
`;

WrapperSpan.displayName = 'WrapperSpan';
