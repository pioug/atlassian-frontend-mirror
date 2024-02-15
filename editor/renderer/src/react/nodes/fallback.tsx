import React from 'react';
import { InlineCard } from './';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource';

export type CardErrorBoundaryProps = {
  unsupportedComponent: React.ComponentType;
};

export class CardErrorBoundary extends React.PureComponent<
  {
    url?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>, url?: string) => void;
    isDatasource?: boolean;
    children?: React.ReactNode;
  } & CardErrorBoundaryProps
> {
  state = {
    isError: false,
  };

  onClickFallback = (e: React.MouseEvent<HTMLElement>) => {
    const { onClick, url } = this.props;
    e.preventDefault();

    if (onClick) {
      onClick(e, url);
    }
  };

  static getDerivedStateFromError() {
    return { isError: true };
  }

  render() {
    if (this.state.isError) {
      const {
        url,
        isDatasource,
        unsupportedComponent: UnsupportedComponent,
      } = this.props;
      if (url) {
        const fallback = (
          <a href={url} onClick={this.onClickFallback}>
            {url}
          </a>
        );

        if (isDatasource) {
          if (isSafeUrl(url)) {
            return (
              <LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
                <InlineCard {...this.props} />
              </LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
            );
          } else {
            return (
              <LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
                {fallback}
              </LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
            );
          }
        } else {
          return fallback;
        }
      } else {
        return <UnsupportedComponent />;
      }
    }

    return this.props.children;
  }

  componentDidCatch(_error: Error) {
    this.setState({ isError: true });
  }
}
