import React from 'react';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { InlineCardResolvingView } from '@atlaskit/media-ui';
import { InlineMediaCardProps } from './inlineMediaCard';

export type InlineMediaCardWithMediaClientConfigProps = WithMediaClientConfigProps<
  InlineMediaCardProps
>;

type InlineMediaCardWithMediaClientConfigComponent = React.ComponentType<
  InlineMediaCardWithMediaClientConfigProps
>;

type ErrorBoundaryComponent = React.ComponentType<{
  data?: { [k: string]: any };
}>;

export interface InlineMediaCardLoaderState {
  InlineMediaCard?: InlineMediaCardWithMediaClientConfigComponent;
  ErrorBoundary?: ErrorBoundaryComponent;
}

export default class InlineMediaCardLoader extends React.PureComponent<
  InlineMediaCardWithMediaClientConfigProps & InlineMediaCardLoaderState,
  InlineMediaCardLoaderState
> {
  static displayName = 'InlineMediaCardLoader';
  static InlineMediaCard?: InlineMediaCardWithMediaClientConfigComponent;
  static ErrorBoundary?: ErrorBoundaryComponent;

  state: InlineMediaCardLoaderState = {
    InlineMediaCard: InlineMediaCardLoader.InlineMediaCard,
  };

  async componentDidMount() {
    if (!this.state.InlineMediaCard) {
      try {
        const [
          mediaClient,
          cardModule,
          mediaCardErrorBoundaryModule,
        ] = await Promise.all([
          import(
            /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_inline-media-card" */ './inlineMediaCard'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-card-error-boundary" */ '../media-card-analytics-error-boundary'
          ),
        ]);

        InlineMediaCardLoader.InlineMediaCard = mediaClient.withMediaClient(
          cardModule.InlineMediaCard,
        );
        InlineMediaCardLoader.ErrorBoundary =
          mediaCardErrorBoundaryModule.default;

        this.setState({
          InlineMediaCard: InlineMediaCardLoader.InlineMediaCard,
          ErrorBoundary: InlineMediaCardLoader.ErrorBoundary,
        });
      } catch (error) {}
    }
  }

  render() {
    const { InlineMediaCard, ErrorBoundary } = this.state;

    if (!InlineMediaCard || !ErrorBoundary) {
      return <InlineCardResolvingView url="" />;
    }

    return (
      <ErrorBoundary>
        <InlineMediaCard {...this.props} />
      </ErrorBoundary>
    );
  }
}
