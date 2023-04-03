import React, { ReactNode } from 'react';
import { FeatureFlagsWrapper } from '@atlaskit/media-test-helpers';

import { UfoLoggerWrapper } from './UfoWrapper';
import { IntlProvider } from 'react-intl-next';

export const MainWrapper = ({ children }: { children: ReactNode }) => (
  <UfoLoggerWrapper>
    <FeatureFlagsWrapper>
      <IntlProvider locale={'en'}>{children}</IntlProvider>
    </FeatureFlagsWrapper>
  </UfoLoggerWrapper>
);
