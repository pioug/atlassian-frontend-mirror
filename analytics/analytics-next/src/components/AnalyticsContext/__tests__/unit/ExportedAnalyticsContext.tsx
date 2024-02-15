import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import AnalyticsContext from '../../index';

jest.mock('../../LegacyAnalyticsContext', () => ({
  __esModule: true,
  default: () => <div>LegacyAnalytics</div>,
}));

jest.mock('../../ModernAnalyticsContext', () => ({
  __esModule: true,
  default: () => <div>ModernAnalytics</div>,
}));

describe('ExportedAnalyticsListener', () => {
  ffTest(
    'platform.analytics-next-use-modern-context_fqgbx',
    () => {
      render(
        <AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
          <div>SomeComponent</div>
        </AnalyticsContext>,
      );

      // when the ff is on- we expect the modern context to be used
      expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
    },
    () => {
      render(
        <AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
          <div>SomeComponent</div>
        </AnalyticsContext>,
      );

      // when the ff is off - we expect the legacy context to be used
      expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
    },
  );
});
