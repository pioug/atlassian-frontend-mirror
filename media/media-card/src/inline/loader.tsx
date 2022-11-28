import React from 'react';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
import { MediaInlineCardProps } from './mediaInlineCard';

export type MediaInlineCardWithMediaClientConfigProps =
  WithMediaClientConfigProps<MediaInlineCardProps>;

type MediaInlineCardWithMediaClientConfigComponent =
  React.ComponentType<MediaInlineCardWithMediaClientConfigProps>;

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
  isMounted = false;

  state: MediaInlineCardLoaderState = {
    MediaInlineCard: MediaInlineCardLoader.MediaInlineCard,
    ErrorBoundary: MediaInlineCardLoader.ErrorBoundary,
  };

  async componentDidMount() {
    this.isMounted = true;
    if (!this.state.MediaInlineCard) {
      try {
        const [mediaClient, cardModule, mediaCardErrorBoundaryModule] =
          await Promise.all([
            import(
              /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
            ),
            import(
              /* webpackChunkName: "@atlaskit-internal_inline-media-card" */ './mediaInlineCard'
            ),
            import(
              /* webpackChunkName: "@atlaskit-internal_media-card-error-boundary" */ '../utils/media-card-analytics-error-boundary'
            ),
          ]);

        MediaInlineCardLoader.MediaInlineCard = mediaClient.withMediaClient(
          cardModule.MediaInlineCard,
        );
        MediaInlineCardLoader.ErrorBoundary =
          mediaCardErrorBoundaryModule.default;

        if (this.isMounted) {
          this.setState({
            MediaInlineCard: MediaInlineCardLoader.MediaInlineCard,
            ErrorBoundary: MediaInlineCardLoader.ErrorBoundary,
          });
        }
      } catch (error) {}
    }
  }

  async componentWillUnmount() {
    this.isMounted = false;
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
