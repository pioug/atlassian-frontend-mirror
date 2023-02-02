import React, { ReactNode } from 'react';
import { FeatureFlagsWrapper } from '@atlaskit/media-test-helpers';
import { LOGGED_FEATURE_FLAGS } from '../src/util/analytics';

import { UfoLoggerWrapper } from './UfoWrapper';
import { IntlProvider } from 'react-intl-next';

export const MainWrapper = ({ children }: { children: ReactNode }) => (
  <UfoLoggerWrapper>
    <FeatureFlagsWrapper filterFlags={LOGGED_FEATURE_FLAGS}>
      <IntlProvider locale={'en'}>{children}</IntlProvider>
    </FeatureFlagsWrapper>
  </UfoLoggerWrapper>
);
