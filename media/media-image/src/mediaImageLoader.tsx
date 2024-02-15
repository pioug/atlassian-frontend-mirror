import React from 'react';
import { MediaImageWithMediaClientConfigProps } from './types';

export interface AsyncMediaImageState {
  MediaImage?: React.ComponentType<MediaImageWithMediaClientConfigProps>;
}
export class MediaImageLoader extends React.PureComponent<
  MediaImageWithMediaClientConfigProps,
  AsyncMediaImageState
> {
  static displayName = 'AsyncMediaImage';
  static MediaImage?: React.ComponentType<MediaImageWithMediaClientConfigProps>;

  state: AsyncMediaImageState = {
    // Set state value to equal to current static value of this class.
    MediaImage: MediaImageLoader.MediaImage,
  };

  async componentDidMount() {
    if (!this.state.MediaImage) {
      try {
        const [mediaClient, mediaImageModule] = await Promise.all([
          import(
            /* webpackChunkName: "@atlaskit-internal_media-client-react" */ '@atlaskit/media-client-react'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-image" */ './mediaImage'
          ),
        ]);

        const MediaImageWithClient = mediaClient.withMediaClient(
          mediaImageModule.MediaImageInternal,
        );
        MediaImageLoader.MediaImage = MediaImageWithClient;

        this.setState({
          MediaImage: MediaImageWithClient,
        });
      } catch (error) {
        // TODO [MS-2277]: Add operational error to catch async import error
      }
    }
  }

  render() {
    const { MediaImage } = this.state;

    if (!MediaImage) {
      return this.props.children({
        loading: true,
        error: false,
        data: undefined,
      });
    }

    return <MediaImage {...this.props} />;
  }
}
