import { AnalyticsContext } from '@atlaskit/analytics-next';
import React, { memo } from 'react';
import { LazySuspense, lazyForPaint } from 'react-loosely-lazy';
import { COMPONENT_NAME } from '../common/constants';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { PackageMetaDataType } from '../analytics.codegen';
import ErrorBoundary from './error-boundary';
import { LinkPickerProps } from './link-picker';
import { LoaderFallback } from './loader-fallback';
import { LinkPickerSessionProvider } from '../controllers/session-provider';

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
    <LinkPickerSessionProvider>
      <ErrorBoundary>
        <LazySuspense fallback={LoaderFallback}>
          <LazyLinkPicker {...props} />
        </LazySuspense>
      </ErrorBoundary>
    </LinkPickerSessionProvider>
  </AnalyticsContext>
));
