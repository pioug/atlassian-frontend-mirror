import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { N500 } from '@atlaskit/theme/colors';

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
  color: ${N500};
`;
