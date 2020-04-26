import React from 'react';

import styled from 'styled-components';

import { borderRadius, colors } from '@atlaskit/theme';

import Badge from '../../src';

const BackgroundContainer = styled.div`
  background-color: ${colors.B400};
  border-radius: ${borderRadius}px;
  padding: 8px;
`;

export default () => (
  <BackgroundContainer>
    <Badge appearance="primaryInverted">{5}</Badge>
  </BackgroundContainer>
);
