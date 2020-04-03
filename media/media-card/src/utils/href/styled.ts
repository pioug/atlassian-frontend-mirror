import styled from 'styled-components';

import { ComponentClass, AnchorHTMLAttributes } from 'react';

export const A: ComponentClass<AnchorHTMLAttributes<{}>> = styled.a`
  text-decoration: none;
  outline: 0 !important;

  &:hover {
    text-decoration: none;
  }

  &.underline {
    &:hover {
      text-decoration: underline;
    }
  }
`;
