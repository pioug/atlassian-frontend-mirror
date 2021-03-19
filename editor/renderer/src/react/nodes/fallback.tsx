import React from 'react';

export type CardErrorBoundaryProps = {
  unsupportedComponent: React.ComponentType;
};

export class CardErrorBoundary extends React.PureComponent<
  {
    url?: string;
    data?: object;
    onClick?: (e: React.MouseEvent<HTMLElement>, url?: string) => void;
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

  render() {
    if (this.state.isError) {
      const { url } = this.props;
      if (url) {
        return (
          <a href={url} onClick={this.onClickFallback}>
            {url}
          </a>
        );
      } else {
        const { unsupportedComponent: UnsupportedComponent } = this.props;
        return <UnsupportedComponent />;
      }
    }

    return this.props.children;
  }

  componentDidCatch(_error: Error) {
    this.setState({ isError: true });
  }
}
