import { AnalyticsContext } from '@atlaskit/analytics-next';
import React, { memo } from 'react';
import { LazySuspense, lazyForPaint } from 'react-loosely-lazy';
import { COMPONENT_NAME } from '../common/constants';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { PackageMetaDataType } from '../common/utils/analytics/analytics.codegen';
import { ErrorBoundary } from './error-boundary';
import { LinkPickerProps } from './link-picker';
import { LoaderFallback } from './loader-fallback';
import { LinkPickerSessionProvider } from '../controllers/session-provider';
import { MessagesProvider } from './messages-provider';

export const testIds = {
  linkPickerRoot: 'link-picker-root',
};

export const PACKAGE_DATA: PackageMetaDataType = {
  packageName,
  packageVersion,
  componentName: COMPONENT_NAME,
  source: COMPONENT_NAME,
};

const LazyLinkPicker = lazyForPaint(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_link-picker" */
    './link-picker'
  ).then(({ LinkPicker }) => ({ default: LinkPicker })),
);

const DefaultRootComponent = ({
  children,
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> &
  LinkPickerProps) => {
  return <div data-testid={testIds.linkPickerRoot}>{children}</div>;
};

export const ComposedLinkPicker = memo((props: LinkPickerProps) => {
  const { component } = props;
  const RootComponent = component ?? DefaultRootComponent;
  return (
    <AnalyticsContext data={PACKAGE_DATA}>
      <LinkPickerSessionProvider>
        <MessagesProvider>
          <ErrorBoundary>
            <LazySuspense
              fallback={
                <LoaderFallback hideDisplayText={props.hideDisplayText} />
              }
            >
              <RootComponent {...props} data-testid={testIds.linkPickerRoot}>
                <LazyLinkPicker {...props} />
              </RootComponent>
            </LazySuspense>
          </ErrorBoundary>
        </MessagesProvider>
      </LinkPickerSessionProvider>
    </AnalyticsContext>
  );
});
