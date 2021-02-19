import React from 'react';

import Spinner from '@atlaskit/spinner';

import {
  CardContent,
  CardHeader,
  CardWrapper,
  LoadingWrapper,
} from '../styled/TeamCard';

export default () => (
  <CardWrapper data-testid="team-profilecard">
    <CardHeader isLoading />
    <CardContent>
      <LoadingWrapper data-testid="team-profilecard-spinner">
        <Spinner />
      </LoadingWrapper>
    </CardContent>
  </CardWrapper>
);
