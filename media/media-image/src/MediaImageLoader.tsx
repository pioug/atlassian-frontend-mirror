import React, { ReactNode } from 'react';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { MediaImageInternalProps, MediaImageState } from './mediaImage';

export interface MediaImageLoaderChildrenProps {
  loading: boolean;
  error: boolean;
  data: MediaImageState | undefined;
}
export type MediaImageLoaderProps = MediaImageWithMediaClientConfigProps &
  AsyncMediaImageState & {
    children: (props: MediaImageLoaderChildrenProps) => ReactNode;
  };

export type MediaImageWithMediaClientConfigProps = WithMediaClientConfigProps<
  MediaImageInternalProps
>;

type MediaImageWithMediaClientConfigComponent = React.ComponentType<
  MediaImageWithMediaClientConfigProps
>;

export interface AsyncMediaImageState {
  MediaImage?: MediaImageWithMediaClientConfigComponent;
}

export class MediaImageLoader extends React.PureComponent<
  MediaImageLoaderProps,
  AsyncMediaImageState
> {
  static displayName = 'AsyncMediaImage';
  static MediaImage?: MediaImageWithMediaClientConfigComponent;

  state: AsyncMediaImageState = {
    // Set state value to equal to current static value of this class.
    MediaImage: MediaImageLoader.MediaImage,
  };

  async componentDidMount() {
    if (!this.state.MediaImage) {
      try {
        const [mediaClient, mediaImageModule] = await Promise.all([
          import(
            /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
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
