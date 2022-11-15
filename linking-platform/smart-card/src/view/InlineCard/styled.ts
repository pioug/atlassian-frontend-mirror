import styled from '@emotion/styled';
import { B400, N200 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

const LINK_COLOR_DARK = '#4794FF';

// By default buttons will hide overflow and ellipsis content instead of wrapping.
// This basically turns the button back into inline content
export const IconStyledButton = styled.span`
  text-align: initial !important;
  display: inline !important;

  &:hover {
    /* Remove the text-decoration to match other inline card hover states */
    text-decoration: none !important;
  }

  > span {
    display: inline;
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
`;

export const LowercaseAppearance = styled.span`
  text-transform: lowercase;
`;

export const LinkAppearance = styled.span`
  color: ${themed({
    light: token('color.link', B400),
    dark: token('color.link', LINK_COLOR_DARK),
  })};
`;
