import React from 'react';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
import { MediaInlineCardProps } from './mediaInlineCard';

export type MediaInlineCardWithMediaClientConfigProps = WithMediaClientConfigProps<
  MediaInlineCardProps
>;

type MediaInlineCardWithMediaClientConfigComponent = React.ComponentType<
  MediaInlineCardWithMediaClientConfigProps
>;

type ErrorBoundaryComponent = React.ComponentType<{
  data?: { [k: string]: any };
}>;

export interface MediaInlineCardLoaderState {
  MediaInlineCard?: MediaInlineCardWithMediaClientConfigComponent;
  ErrorBoundary?: ErrorBoundaryComponent;
}

export default class MediaInlineCardLoader extends React.PureComponent<
  MediaInlineCardWithMediaClientConfigProps & MediaInlineCardLoaderState,
  MediaInlineCardLoaderState
> {
  static displayName = 'MediaInlineCardLoader';
  static MediaInlineCard?: MediaInlineCardWithMediaClientConfigComponent;
  static ErrorBoundary?: ErrorBoundaryComponent;

  state: MediaInlineCardLoaderState = {
    MediaInlineCard: MediaInlineCardLoader.MediaInlineCard,
  };

  async componentDidMount() {
    if (!this.state.MediaInlineCard) {
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
            /* webpackChunkName: "@atlaskit-internal_inline-media-card" */ './mediaInlineCard'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-card-error-boundary" */ '../media-card-analytics-error-boundary'
          ),
        ]);

        MediaInlineCardLoader.MediaInlineCard = mediaClient.withMediaClient(
          cardModule.MediaInlineCard,
        );
        MediaInlineCardLoader.ErrorBoundary =
          mediaCardErrorBoundaryModule.default;

        this.setState({
          MediaInlineCard: MediaInlineCardLoader.MediaInlineCard,
          ErrorBoundary: MediaInlineCardLoader.ErrorBoundary,
        });
      } catch (error) {}
    }
  }

  render() {
    const { MediaInlineCard, ErrorBoundary } = this.state;

    if (!MediaInlineCard || !ErrorBoundary) {
      return <MediaInlineCardLoadingView message="" />;
    }

    return (
      <ErrorBoundary>
        <MediaInlineCard {...this.props} />
      </ErrorBoundary>
    );
  }
}
