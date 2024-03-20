/* eslint-disable @repo/internal/react/no-class-components */
import React from 'react';

import { isSafeUrl } from '@atlaskit/adf-schema';
import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource';
import type { APIError } from '@atlaskit/smart-card';

import type { DatasourceProps } from './nodeviews/datasource';
import { setSelectedCardAppearance } from './pm-plugins/doc';

export type DatasourceErrorBoundaryProps = React.PropsWithChildren<{
  url?: string;
  unsupportedComponent?: React.ComponentType<React.PropsWithChildren<unknown>>;
  handleError?: () => void;
  view: DatasourceProps['view'];
  // Only used in Sentry tagging
  datasourceModalType?: DatasourceModalType;
  datasourceId?: string;
}>;

export class DatasourceErrorBoundary extends React.Component<DatasourceErrorBoundaryProps> {
  state = {
    isError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error | APIError) {
    return { isError: true, error };
  }

  componentDidCatch(error: Error | APIError) {
    if (this.props.handleError) {
      this.props.handleError();
    }
    // prevent re-render children with error
    if (this.state.isError) {
      this.setState({ isError: true, error });
    }
  }

  render() {
    const {
      url,
      unsupportedComponent: UnsupportedComponent,
      view,
      datasourceModalType,
      datasourceId,
    } = this.props;

    if (this.state.isError) {
      if (url && isSafeUrl(url)) {
        return (
          <LazyLoadedDatasourceRenderFailedAnalyticsWrapper
            datasourceId={datasourceId}
            error={this.state.error}
          >
            {setSelectedCardAppearance('inline', undefined)(
              view.state,
              view.dispatch,
            )}
          </LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
        );
      } else {
        const unsupportedComponent = UnsupportedComponent ? (
          <UnsupportedComponent />
        ) : null;

        return (
          <LazyLoadedDatasourceRenderFailedAnalyticsWrapper
            datasourceModalType={datasourceModalType}
            datasourceId={datasourceId}
            error={this.state.error}
          >
            {unsupportedComponent}
          </LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
        );
      }
    } else {
      return this.props.children;
    }
  }
}
