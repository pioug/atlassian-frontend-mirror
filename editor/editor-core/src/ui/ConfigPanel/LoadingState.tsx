import React from 'react';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

export default () => (
  <SpinnerWrapper>
    <Spinner size="small" />
  </SpinnerWrapper>
);
