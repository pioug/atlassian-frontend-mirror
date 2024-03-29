import { Component, ReactNode } from 'react';
import {
  MediaClient,
  FileState,
  MediaStoreGetFileImageParams,
  isDifferentIdentifier,
  FileIdentifier,
  MediaSubscription,
} from '@atlaskit/media-client';

import { MediaImageChildrenProps, MediaImageState } from './types';
import type { SSR } from '@atlaskit/media-common';
export interface MediaImageInternalProps {
  /** Instance of file identifier */
  identifier: FileIdentifier;
  /** Instance of Media MediaClient */
  mediaClient: MediaClient;
  /** Media API Configuration object */
  apiConfig?: MediaStoreGetFileImageParams;
  /** Render props returning `MediaImageChildrenProps` data structure */
  children: (props: MediaImageChildrenProps) => ReactNode;
  /** Server-Side-Rendering modes are "server" and "client" */
  ssr?: SSR;
}

export class MediaImageInternal extends Component<
  MediaImageInternalProps,
  MediaImageState
> {
  subscription?: MediaSubscription;
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
    const isDifferentAuth =
      otherNewProps.mediaClient.mediaClientConfig.authProvider !==
      mediaClient.mediaClientConfig.authProvider;

    if (
      (!!newIdentifier && isDifferentIdentifier(newIdentifier, identifier)) ||
      isNewDimensionsBigger ||
      isDifferentAuth
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

  private subscribe(props: MediaImageInternalProps) {
    const {
      mediaClient,
      identifier: { id, collectionName },
      apiConfig,
    } = props;
    this.unsubscribe();
    this.setState({ status: 'loading' });

    this.subscription = mediaClient.file
      .getFileState(id, { collectionName })
      .subscribe({
        next: async (fileState: FileState) => {
          if (fileState.status === 'error' || fileState.mediaType !== 'image') {
            this.setState({ status: 'error' });
            return;
          }

          const { preview } = fileState;

          if (preview) {
            let value: string | Blob;
            try {
              value = (await preview).value;
            } catch (err) {
              this.setState({ status: 'error' });
              return;
            }

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
            const blob = await mediaClient.getImage(id, {
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
