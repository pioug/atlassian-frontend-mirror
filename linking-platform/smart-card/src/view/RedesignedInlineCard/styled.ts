import styled from '@emotion/styled';
import { B400, N200 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

const LINK_COLOR_DARK = '#4794FF';

// By default buttons will hide overflow and ellipsis content instead of wrapping.
// This basically turns the button back into inline content
// There is a workaround for negative token spacing suggested by the design system team. calc(${token} * -1)
export const IconStyledButton = styled.span`
  &&& {
    text-align: initial;
    display: inline;
    vertical-align: baseline;
    border-radius: ${token('border.radius.100', '2px')};
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding: ${token('space.025', '2px')} ${token('space.075', '6px')};
    background-clip: padding-box;
    box-decoration-break: clone;
  }
  > span {
    display: inline;
    overflow: initial;
    text-overflow: initial;
    white-space: initial;
    > span {
      overflow: initial;
      text-overflow: initial;
      white-space: initial;
    }
  }
`;

export const NoLinkAppearance = styled.span`
  color: ${themed({
    light: token('color.text.subtlest', N200),
    dark: token('color.text.subtlest', LINK_COLOR_DARK),
  })};
  margin-left: ${token('space.050', '4px')};
`;

export const LowercaseAppearance = styled.span`
  text-transform: lowercase;
`;

export const LinkAppearance = styled.a`
  color: ${themed({
    light: token('color.link', B400),
    dark: token('color.link', LINK_COLOR_DARK),
  })};

  &:hover {
    text-decoration: none;
  }
`;
