import React, { useEffect } from 'react';

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import AkSpinner from '@atlaskit/spinner';

import { SpinnerContainer } from '../../styled/Card';
import { profileCardRendered } from '../../util/analytics';

interface AnalyticsProps {
  fireAnalytics: (payload: AnalyticsEventPayload) => void;
}

const UserLoadingState = ({ fireAnalytics }: AnalyticsProps) => {
  useEffect(() => {
    fireAnalytics(profileCardRendered('user', 'spinner'));
  }, [fireAnalytics]);

  return (
    <SpinnerContainer>
      <AkSpinner />
    </SpinnerContainer>
  );
};

export default UserLoadingState;
