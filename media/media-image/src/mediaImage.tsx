import { Component, ReactNode } from 'react';
import {
  MediaClient,
  FileState,
  FileIdentifier,
  isDifferentIdentifier,
  withMediaClient,
  MediaStoreGetFileImageParams,
  WithMediaClientConfig,
} from '@atlaskit/media-client';
import { Subscription } from 'rxjs/Subscription';

export interface MediaImageChildrenProps {
  /** Boolean with value to check if component is loading image source from API */
  loading: boolean;
  /** Boolean with value to check if there was an error during the image load from media API */
  error: boolean;
  /** Data structure with image data, if media API returned with success */
  data: MediaImageState | undefined;
}
export interface MediaImageInternalProps {
  /** Instance of file identifier */
  identifier: FileIdentifier;
  /** Instance of Media MediaClient */
  mediaClient: MediaClient;
  /** Media API Configuration object */
  apiConfig?: MediaStoreGetFileImageParams;
  /** Render props returning `MediaImageChildrenProps` data structure */
  children: (props: MediaImageChildrenProps) => ReactNode;
}

export interface MediaImageState {
  /** Current status of the image to be loaded */
  status: 'loading' | 'error' | 'processed' | 'succeeded';
  /** Image source. It will be added in case the request for the image returns with success or image preview is available */
  src?: string;
}

export class MediaImageInternal extends Component<
  MediaImageInternalProps,
  MediaImageState
> {
  subscription?: Subscription;
  state: MediaImageState = {
    status: 'loading',
  };

  static defaultProps = {
    apiConfig: {},
  };

  componentDidMount() {
    this.subscribe(this.props);
  }

  UNSAFE_componentWillReceiveProps({
    apiConfig: newApiConfig = {},
    identifier: newIdentifier,
    ...otherNewProps
  }: MediaImageInternalProps) {
    const { apiConfig = {}, identifier, mediaClient } = this.props;
    const isWidthBigger =
      newApiConfig.width &&
      apiConfig.width &&
      newApiConfig.width > apiConfig.width;
    const isHeightBigger =
      newApiConfig.height &&
      apiConfig.height &&
      newApiConfig.height > apiConfig.height;

    const isNewDimensionsBigger = isWidthBigger || isHeightBigger;

    if (
      (!!newIdentifier && isDifferentIdentifier(newIdentifier, identifier)) ||
      isNewDimensionsBigger ||
      otherNewProps.mediaClient !== mediaClient
    ) {
      this.subscribe({
        identifier: newIdentifier,
        apiConfig: newApiConfig,
        ...otherNewProps,
      });
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.releaseSrc();
  }

  private releaseSrc = () => {
    const { src } = this.state;
    if (src) {
      URL.revokeObjectURL(src);
    }
  };

  private async subscribe(props: MediaImageInternalProps) {
    const {
      mediaClient,
      identifier: { id, collectionName },
      apiConfig,
    } = props;
    this.unsubscribe();
    this.setState({ status: 'loading' });

    const fileId = await id;

    this.subscription = mediaClient.file
      .getFileState(fileId, { collectionName })
      .subscribe({
        next: async (fileState: FileState) => {
          if (fileState.status === 'error' || fileState.mediaType !== 'image') {
            this.setState({ status: 'error' });
            return;
          }

          const { preview } = fileState;

          if (preview) {
            const value = (await preview).value;

            // NOTE: Preview is referring to the local image
            // after page reload it will get the image src
            // based on the API
            // PS: it will the case for third-party, such as Giphy
            if (typeof value !== 'string') {
              this.setSourceFromBlob(value);
              return;
            }
          }

          if (fileState.status === 'processed') {
            const blob = await mediaClient.getImage(fileId, {
              collection: collectionName,
              ...apiConfig,
            });
            this.setSourceFromBlob(blob);
          }
        },
        error: () => this.setState({ status: 'error' }),
      });
  }

  private setSourceFromBlob(blob: Blob) {
    const src = URL.createObjectURL(blob);
    this.releaseSrc();

    this.setState({
      status: 'succeeded',
      src,
    });
    this.unsubscribe();
  }

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  render() {
    return this.props.children({
      loading: this.state.status === 'loading',
      error: this.state.status === 'error',
      data: this.state.status === 'succeeded' ? this.state : undefined,
    });
  }
}

export type MediaImageProps = MediaImageInternalProps & WithMediaClientConfig;
export const MediaImage = withMediaClient(MediaImageInternal);
