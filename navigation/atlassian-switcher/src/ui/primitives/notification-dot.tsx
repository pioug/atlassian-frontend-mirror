import React from 'react';
import styled from 'styled-components';
import * as colors from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

const Container = styled.div`
  position: relative;
`;

const NotificationDot = styled.span`
  position: absolute;
  top: -${gridSize() / 4}px;
  right: -${gridSize() / 4}px;
  background: ${colors.R400};
  border-radius: ${gridSize() * 0.625}px;
  height: ${gridSize() * 1.25}px;
  width: ${gridSize() * 1.25}px;
`;

export default ({ children }: { children: React.ReactNode }) => (
  <Container>
    <NotificationDot />
    {children}
  </Container>
);
