import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';

export const TriggerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
`;

export const Separator: ComponentClass<HTMLAttributes<{}>> = styled.span`
  background: ${colors.N30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  align-items: center;
  div {
    display: flex;
  }
`;

export const ExpandIconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: -8px;
`;
