import React from 'react';
import { EventHandlers } from '@atlaskit/editor-common';
import { getEventHandler } from '../../utils';

export type CardErrorBoundaryProps = {
  unsupportedComponent: React.ComponentType;
};

export class CardErrorBoundary extends React.PureComponent<
  {
    url?: string;
    data?: object;
    eventHandlers?: EventHandlers;
  } & CardErrorBoundaryProps
> {
  state = {
    isError: false,
  };

  onClickFallback = (e: React.MouseEvent) => {
    e.preventDefault();

    const { eventHandlers, url } = this.props;
    const handler = getEventHandler(eventHandlers, 'smartCard');
    if (url && handler) {
      handler(url);
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
