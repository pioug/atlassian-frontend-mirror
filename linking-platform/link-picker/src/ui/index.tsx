/** @jsx jsx */
import React, { Fragment, memo } from 'react';

import { jsx } from '@emotion/react';
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { COMPONENT_NAME, LINK_PICKER_WIDTH_IN_PX } from '../common/constants';
import { PackageMetaDataType } from '../common/utils/analytics/analytics.codegen';
import { LinkPickerSessionProvider } from '../controllers/session-provider';

import { ErrorBoundary } from './error-boundary';
import { LinkPickerProps } from './link-picker';
import { LoaderFallback } from './loader-fallback';
import { MessagesProvider } from './messages-provider';
import { fixedWidthContainerStyles } from './styled';

export const testIds = {
  linkPickerRoot: 'link-picker-root',
};

export const PACKAGE_DATA: PackageMetaDataType = {
  packageName: process.env._PACKAGE_NAME_,
  packageVersion: process.env._PACKAGE_VERSION_,
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

const FixedWidthContainer = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return <div css={fixedWidthContainerStyles} {...props} />;
};

const ComposedLinkPicker = memo((props: LinkPickerProps) => {
  const { component } = props;
  const RootComponent = component ?? DefaultRootComponent;

  /**
   * When ff enabled: root container will provide width to component + loader + error boundary
   * When ff disabled: component + loader + error boundary each providing their own width
   * Cannot make this change easier at risk of regression as external adopters may have css override on the form element
   */
  const RootFixedWidthContainer = getBooleanFF(
    'platform.linking-platform.link-picker.fixed-height-search-results',
  )
    ? FixedWidthContainer
    : Fragment;
  const LoaderFallbackContainer = getBooleanFF(
    'platform.linking-platform.link-picker.fixed-height-search-results',
  )
    ? Fragment
    : FixedWidthContainer;

  return (
    <AnalyticsContext data={PACKAGE_DATA}>
      <LinkPickerSessionProvider>
        <MessagesProvider>
          <div
            style={{
              ['--link-picker-width' as string]: props.disableWidth
                ? '100%'
                : `${LINK_PICKER_WIDTH_IN_PX}px`,
              ['--link-picker-padding-left' as string]:
                props.paddingLeft ?? token('space.200', '16px'),
              ['--link-picker-padding-right' as string]:
                props.paddingRight ?? token('space.200', '16px'),
              ['--link-picker-padding-top' as string]:
                props.paddingTop ?? token('space.200', '16px'),
              ['--link-picker-padding-bottom' as string]:
                props.paddingBottom ?? token('space.200', '16px'),
            }}
          >
            <RootFixedWidthContainer>
              <ErrorBoundary>
                <LazySuspense
                  fallback={
                    <LoaderFallbackContainer>
                      <LoaderFallback
                        hideDisplayText={props.hideDisplayText}
                        isLoadingPlugins={props.isLoadingPlugins}
                        plugins={props.plugins}
                      />
                    </LoaderFallbackContainer>
                  }
                >
                  <RootComponent
                    {...props}
                    data-testid={testIds.linkPickerRoot}
                  >
                    <LazyLinkPicker {...props} />
                  </RootComponent>
                </LazySuspense>
              </ErrorBoundary>
            </RootFixedWidthContainer>
          </div>
        </MessagesProvider>
      </LinkPickerSessionProvider>
    </AnalyticsContext>
  );
});

// Must be a default export to be able to support prop docs
// eslint-disable-next-line import/no-default-export
export default ComposedLinkPicker;
