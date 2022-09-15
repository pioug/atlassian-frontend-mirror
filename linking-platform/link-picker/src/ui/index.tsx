import React, { memo } from 'react';
import { LazySuspense, lazyForPaint } from 'react-loosely-lazy';
import { AnalyticsContext } from '@atlaskit/analytics-next';

import { COMPONENT_NAME, ANALYTICS_CHANNEL } from '../common/constants';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { PackageMetaDataType } from '../analytics.codegen';
import ErrorBoundary from './error-boundary';
import { ErrorBoundaryFallback } from './error-boundary-fallback';
import { LinkPickerProps } from './link-picker';
import { LoaderFallback } from './loader-fallback';

export const PACKAGE_DATA: PackageMetaDataType = {
  packageName,
  packageVersion,
  componentName: COMPONENT_NAME,
  source: COMPONENT_NAME,
};

const LazyLinkPicker = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker" */
      './link-picker'
    ),
);

export const ComposedLinkPicker = memo((props: LinkPickerProps) => (
  <AnalyticsContext data={PACKAGE_DATA}>
    <ErrorBoundary
      channel={ANALYTICS_CHANNEL}
      ErrorComponent={ErrorBoundaryFallback}
    >
      <LazySuspense fallback={LoaderFallback}>
        <LazyLinkPicker {...props} />
      </LazySuspense>
    </ErrorBoundary>
  </AnalyticsContext>
));
