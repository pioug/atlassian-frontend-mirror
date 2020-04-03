import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';

export const DropdownItem: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 32px 8px 12px;
  color: ${colors.N800};
  > span {
    display: flex;
    margin-right: 8px;
  }
  &:hover {
    background-color: ${colors.N20};
  }
`;
