import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

export const TriggerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  width: 42px;

  display: flex;
  align-items: center;

  > div,
  > span {
    display: flex;
  }

  > div > div {
    display: flex;
  }
`;
