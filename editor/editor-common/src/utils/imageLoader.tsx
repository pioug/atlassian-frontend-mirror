import React, { Component, ComponentType } from 'react';

export interface ImageLoaderProps {
  url?: string;
  onExternalImageLoaded?: (dimensions: {
    width: number;
    height: number;
  }) => void;
  imageStatus?: ImageStatus;
}

export interface ImageLoaderState {
  imageStatus: ImageStatus;
}

export type ImageStatus = 'complete' | 'loading' | 'error';

export const withImageLoader = <P extends {}>(
  Wrapped: ComponentType<P & ImageLoaderProps>,
): React.ComponentClass<P & ImageLoaderProps> =>
  class WithImageLoader extends Component<
    P & ImageLoaderProps,
    ImageLoaderState
  > {
    state: ImageLoaderState = {
      imageStatus: 'loading',
    };

    img?: HTMLImageElement | null;

    componentDidMount() {
      this.fetchImage(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps: ImageLoaderProps) {
      if (nextProps.url !== this.props.url) {
        this.setState({
          imageStatus: 'loading',
        });
        this.fetchImage(nextProps);
      }
    }

    componentWillUnmount() {
      if (this.img) {
        this.img.removeEventListener('load', this.onLoad);
        this.img.removeEventListener('error', this.onError);
        this.img = null;
      }
    }

    fetchImage({ url }: ImageLoaderProps) {
      if (url) {
        if (!this.img) {
          this.img = new Image();
          this.img.addEventListener('load', this.onLoad);
          this.img.addEventListener('error', this.onError);
        }

        this.img.src = url;
      }
    }

    onLoad = () => {
      this.setState({
        imageStatus: 'complete',
      });

      const { onExternalImageLoaded } = this.props;
      if (onExternalImageLoaded && this.img) {
        onExternalImageLoaded({
          width: this.img.naturalWidth,
          height: this.img.naturalHeight,
        });
      }
    };

    onError = () => {
      this.setState({
        imageStatus: 'error',
      });
    };

    render() {
      const { imageStatus } = this.state;
      return <Wrapped {...this.props} imageStatus={imageStatus} />;
    }
  };
