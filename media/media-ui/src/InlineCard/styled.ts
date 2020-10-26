import styled from 'styled-components';
import { ComponentClass, HTMLAttributes } from 'react';
import { B400, N200 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

const LINK_COLOR_DARK = '#4794FF';

// By default buttons will hide overflow and ellipsis content instead of wrapping.
// This basically turns the button back into inline content
export const IconStyledButton: ComponentClass<HTMLAttributes<{}>> = styled.span`
  text-align: initial !important;
  display: inline !important;

  &:hover {
    /* Remove the text-decoration to match other inline card hover states*/
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

export const NoLinkAppearance: ComponentClass<HTMLAttributes<{}>> = styled.span`
  color: ${themed({ light: N200, dark: LINK_COLOR_DARK })};
`;

export const LowercaseAppearance = styled.span`
  text-transform: lowercase;
`;

export const LinkAppearance: ComponentClass<HTMLAttributes<{}>> = styled.span`
  color: ${themed({ light: B400, dark: LINK_COLOR_DARK })};
`;
