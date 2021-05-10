import React from 'react';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { DropzoneProps } from './dropzone';
import { MediaPickerAnalyticsErrorBoundaryProps } from '../media-picker-analytics-error-boundary';

export type DropzoneWithMediaClientConfigProps = WithMediaClientConfigProps<
  DropzoneProps
>;
type DropzoneWithMediaClientConfigComponent = React.ComponentType<
  DropzoneWithMediaClientConfigProps
>;

type MediaPickerErrorBoundaryComponent = React.ComponentType<
  MediaPickerAnalyticsErrorBoundaryProps
>;

export type State = {
  Dropzone?: DropzoneWithMediaClientConfigComponent;
  MediaPickerErrorBoundary?: MediaPickerErrorBoundaryComponent;
};

export class DropzoneLoader extends React.PureComponent<
  DropzoneWithMediaClientConfigProps,
  State
> {
  static displayName = 'AsyncDropzone';
  static Dropzone?: DropzoneWithMediaClientConfigComponent;
  static MediaPickerErrorBoundary?: MediaPickerErrorBoundaryComponent;

  state = {
    Dropzone: DropzoneLoader.Dropzone,
    MediaPickerErrorBoundary: DropzoneLoader.MediaPickerErrorBoundary,
  };

  async UNSAFE_componentWillMount() {
    if (!this.state.Dropzone || !this.state.MediaPickerErrorBoundary) {
      try {
        const [
          mediaClient,
          dropzoneModule,
          mediaPickerErrorBoundaryModule,
        ] = await Promise.all([
          import(
            /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-dropzone" */ './dropzone'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-picker-error-boundary" */ '../media-picker-analytics-error-boundary'
          ),
        ]);

        DropzoneLoader.Dropzone = mediaClient.withMediaClient(
          dropzoneModule.Dropzone,
          this.props.featureFlags,
        );

        DropzoneLoader.MediaPickerErrorBoundary =
          mediaPickerErrorBoundaryModule.default;

        this.setState({
          Dropzone: DropzoneLoader.Dropzone,
          MediaPickerErrorBoundary: DropzoneLoader.MediaPickerErrorBoundary,
        });
      } catch (error) {
        // TODO [MS-2272]: Add operational error to catch async import error
      }
    }
  }

  render() {
    const { Dropzone, MediaPickerErrorBoundary } = this.state;
    if (!Dropzone || !MediaPickerErrorBoundary) {
      return null;
    }

    return (
      <MediaPickerErrorBoundary>
        <Dropzone {...this.props} />
      </MediaPickerErrorBoundary>
    );
  }
}
