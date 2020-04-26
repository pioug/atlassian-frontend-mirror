import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

// By default buttons will hide overflow and ellipsis content instead of wrapping.
// This basically turns the button back into inline content
export const IconStyledButton: ComponentClass<HTMLAttributes<{}>> = styled.span`
  text-align: initial !important;
  display: inline !important;
  > span {
    display: inline;
    > span {
      overflow: initial;
      text-overflow: initial;
      white-space: initial;
    }
  }
`;
