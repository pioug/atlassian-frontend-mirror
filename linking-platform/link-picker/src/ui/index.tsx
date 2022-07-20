import React, { memo } from 'react';
import { AnalyticsErrorBoundary } from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { ErrorBoundaryFallback } from './error-boundary-fallback';
import { LinkPickerWithIntl, LinkPickerProps } from './link-picker';

const COMPONENT_NAME = 'LinkPicker';
const ANALYTICS_CHANNEL = 'media';

const PACKAGE_DATA = {
  packageName,
  packageVersion,
  componentName: COMPONENT_NAME,
};

export const ComposedLinkPicker = memo((props: LinkPickerProps) => (
  <AnalyticsErrorBoundary
    channel={ANALYTICS_CHANNEL}
    data={PACKAGE_DATA}
    ErrorComponent={ErrorBoundaryFallback}
  >
    <LinkPickerWithIntl {...props} />
  </AnalyticsErrorBoundary>
));
