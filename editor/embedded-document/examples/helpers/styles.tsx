import styled from 'styled-components';
import { token } from '@atlaskit/tokens';

export const Container = styled.div`
  padding: 0 ${token('space.250', '20px')};
  background: #fff;
  box-sizing: border-box;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 ${token('space.250', '20px')};
  height: ${token('space.1000', '80px')};
`;
