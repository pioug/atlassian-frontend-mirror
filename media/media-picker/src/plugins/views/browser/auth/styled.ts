import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { N500, N100 } from '@atlaskit/theme/colors';

export const IconWrapper = styled.img`
  width: 120px;
  height: 120px;
`;

export const ButtonWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  text-align: center;
`;

export const TextDescription: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-top: 18px;
  color: ${N500};
  opacity: 0.7;
  font-size: 12px;
  text-align: center;
`;

export const Title: ComponentClass<HTMLAttributes<{}>> = styled.div`
  text-align: center;
  font-size: 16px;
  color: ${N100};
`;

export const ConnectWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 300px;
`;
