import React, { type FunctionComponent } from 'react';

import { SpotlightTarget } from '@atlaskit/onboarding';

export interface ConditionalSpotlightTargetWrapperProps {
  spotlightTargetName?: string;
  children: React.ReactElement;
}

export const ConditionalSpotlightTargetWrapper: FunctionComponent<
  ConditionalSpotlightTargetWrapperProps
> = ({ spotlightTargetName, children }) => {
  return spotlightTargetName ? (
    <SpotlightTarget name={spotlightTargetName}>{children}</SpotlightTarget>
  ) : (
    children
  );
};
