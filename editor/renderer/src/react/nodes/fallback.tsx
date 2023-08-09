import React from 'react';
import { InlineCard } from './';
import { isSafeUrl } from '@atlaskit/adf-schema';

export type CardErrorBoundaryProps = {
  unsupportedComponent: React.ComponentType;
};

export class CardErrorBoundary extends React.PureComponent<
  {
    url?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>, url?: string) => void;
    isDatasource?: boolean;
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
        if (isDatasource && isSafeUrl(url)) {
          return <InlineCard {...this.props} />;
        }
        return (
          <a href={url} onClick={this.onClickFallback}>
            {url}
          </a>
        );
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
