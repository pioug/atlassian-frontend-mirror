import React from 'react';

import styled from 'styled-components';

import { B400 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';

import Badge from '../../src';

const BackgroundContainer = styled.div`
  background-color: ${B400};
  border-radius: ${borderRadius}px;
  padding: 8px;
`;

export default () => (
  <BackgroundContainer>
    <Badge appearance="primaryInverted">{5}</Badge>
  </BackgroundContainer>
);
