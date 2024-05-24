import React from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import LegacyAnalyticsContext from './LegacyAnalyticsContext';
import ModernAnalyticsContext from './ModernAnalyticsContext';
import { type AnalyticsContextFunction } from './types';

const ExportedAnalyticsContext: AnalyticsContextFunction = (props) => {
  const isModernContextEnabledEnv =
    typeof process !== 'undefined' &&
    process !== null &&
    process.env?.['ANALYTICS_NEXT_MODERN_CONTEXT'];

  return isModernContextEnabledEnv ||
    getBooleanFF('platform.analytics-next-use-modern-context_fqgbx') ? (
    <ModernAnalyticsContext {...props} />
  ) : (
    <LegacyAnalyticsContext {...props} />
  );
};

export default ExportedAnalyticsContext;
