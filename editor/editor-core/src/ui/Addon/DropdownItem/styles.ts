import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { N800, N20 } from '@atlaskit/theme/colors';

export const DropdownItem: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 32px 8px 12px;
  color: ${N800};
  > span {
    display: flex;
    margin-right: 8px;
  }
  &:hover {
    background-color: ${N20};
  }
`;
