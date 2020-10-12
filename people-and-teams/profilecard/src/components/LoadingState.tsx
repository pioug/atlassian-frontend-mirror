import React from 'react';
import AkSpinner from '@atlaskit/spinner';

import { SpinnerContainer } from '../styled/Card';

const LoadingState = () => (
  <SpinnerContainer>
    <AkSpinner />
  </SpinnerContainer>
);

export default LoadingState;
