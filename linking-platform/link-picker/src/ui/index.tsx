import React, { memo } from 'react';
import { AnalyticsErrorBoundary } from '@atlaskit/analytics-next';
import { LazySuspense, lazyForPaint } from 'react-loosely-lazy';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { ErrorBoundaryFallback } from './error-boundary-fallback';
import { LinkPickerProps } from './link-picker';
import { LoaderFallback } from './loader-fallback';

const COMPONENT_NAME = 'LinkPicker';
const ANALYTICS_CHANNEL = 'media';

const PACKAGE_DATA = {
  packageName,
  packageVersion,
  componentName: COMPONENT_NAME,
};

const LazyLinkPicker = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker" */
      './link-picker'
    ),
);

export const ComposedLinkPicker = memo((props: LinkPickerProps) => (
  <AnalyticsErrorBoundary
    channel={ANALYTICS_CHANNEL}
    data={PACKAGE_DATA}
    ErrorComponent={ErrorBoundaryFallback}
  >
    <LazySuspense fallback={LoaderFallback}>
      <LazyLinkPicker {...props} />
    </LazySuspense>
  </AnalyticsErrorBoundary>
));
