import React from 'react';
import Badge from '../../src';
import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

const BackgroundContainer = styled.div`
  background-color: ${colors.B400};
  border-radius: ${borderRadius}px;
  padding: 8px;
`;

const PrimaryInverted = () => (
  <BackgroundContainer>
    <Badge appearance="primaryInverted">{5}</Badge>
  </BackgroundContainer>
);

export default PrimaryInverted;
