/* eslint-disable @repo/internal/react/no-class-components */
import React from 'react';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource';
import type { APIError } from '@atlaskit/smart-card';

import type { DatasourceProps } from './nodeviews/datasource';
import { setSelectedCardAppearance } from './pm-plugins/doc';

export class DatasourceErrorBoundary extends React.Component<{
  url?: string;
  unsupportedComponent?: React.ComponentType;
  handleError?: () => void;
  view: DatasourceProps['view'];
}> {
  state = {
    isError: false,
  };

  static getDerivedStateFromError(error: Error | APIError) {
    return { isError: true };
  }

  componentDidCatch(error: Error | APIError) {
    if (this.props.handleError) {
      this.props.handleError();
    }
    // prevent re-render children with error
    if (this.state.isError) {
      this.setState({ isError: true });
    }
  }

  render() {
    const {
      url,
      unsupportedComponent: UnsupportedComponent,
      view,
    } = this.props;

    if (this.state.isError) {
      if (url && isSafeUrl(url)) {
        return (
          <LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
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
          <LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
            {unsupportedComponent}
          </LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
        );
      }
    } else {
      return this.props.children;
    }
  }
}
