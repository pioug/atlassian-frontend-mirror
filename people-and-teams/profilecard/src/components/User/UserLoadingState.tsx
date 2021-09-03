import React from 'react';

import AkSpinner from '@atlaskit/spinner';

import { SpinnerContainer } from '../../styled/Card';

const UserLoadingState = () => (
  <SpinnerContainer>
    <AkSpinner />
  </SpinnerContainer>
);

export default UserLoadingState;
