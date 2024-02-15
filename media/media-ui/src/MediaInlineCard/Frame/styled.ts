import { token } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import { B300, N30A, N40A, N900 } from '@atlaskit/theme/colors';

export interface WrapperProps {
  isSelected?: boolean;
}

const selected = `
  cursor: pointer;
  box-shadow: 0 0 0 1px ${token('color.border.selected', B300)};
  outline: none;
  user-select: none;
  border-color: transparent;
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
export const Wrapper = styled.span<WrapperProps>`
  line-height: 16px;
  padding: ${token('space.025', '2px')} ${token('space.050', '4px')}
    ${token('space.025', '2px')} ${token('space.050', '4px')};
  box-decoration-break: clone;
  display: inline;
  border-radius: ${token('border.radius', '3px')};
  color: ${token('color.text', N900)};
  background-color: ${token('color.background.neutral', N30A)};
  ${(props) => isSelected(props)};
  transition: 0.1s all ease-in-out;
  -moz-user-select: none;
  cursor: pointer;

  &:hover {
    background-color: ${token('color.background.neutral.hovered', N40A)};
  }
`;
