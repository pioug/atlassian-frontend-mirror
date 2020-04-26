import React from 'react';
import Spinner from '@atlaskit/spinner';

import { SpinnerWrapper } from '../../views/styled';

export const PluginLoadingView = () => (
  <SpinnerWrapper>
    <Spinner size="medium" />
  </SpinnerWrapper>
);
