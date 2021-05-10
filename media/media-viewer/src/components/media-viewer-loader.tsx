import React from 'react';
import { ModalSpinner } from '@atlaskit/media-ui';
import * as colors from '@atlaskit/theme/colors';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { MediaViewerProps } from './types';
import { MediaViewerAnalyticsErrorBoundaryProps } from './media-viewer-analytics-error-boundary';

export type MediaViewerWithMediaClientConfigProps = WithMediaClientConfigProps<
  MediaViewerProps
>;

type MediaViewerWithMediaClientConfigComponent = React.ComponentType<
  MediaViewerWithMediaClientConfigProps
>;

type MediaViewerErrorBoundaryComponent = React.ComponentType<
  MediaViewerAnalyticsErrorBoundaryProps
>;

export interface AsyncMediaViewerState {
  MediaViewer?: MediaViewerWithMediaClientConfigComponent;
  MediaViewerErrorBoundary?: MediaViewerErrorBoundaryComponent;
}

export default class AsyncMediaViewer extends React.PureComponent<
  MediaViewerWithMediaClientConfigProps & AsyncMediaViewerState,
  AsyncMediaViewerState
> {
  static displayName = 'AsyncMediaViewer';
  static MediaViewer?: MediaViewerWithMediaClientConfigComponent;
  static MediaViewerErrorBoundary?: MediaViewerErrorBoundaryComponent;

  state: AsyncMediaViewerState = {
    // Set state value to equal to current static value of this class.
    MediaViewer: AsyncMediaViewer.MediaViewer,
    MediaViewerErrorBoundary: AsyncMediaViewer.MediaViewerErrorBoundary,
  };

  async UNSAFE_componentWillMount() {
    if (!this.state.MediaViewer || !this.state.MediaViewerErrorBoundary) {
      try {
        const [
          mediaClient,
          mediaViewerModule,
          mediaViewerErrorBoundaryModule,
        ] = await Promise.all([
          import(
            /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-viewer" */ './media-viewer'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-picker-error-boundary" */ './media-viewer-analytics-error-boundary'
          ),
        ]);

        const MediaViewerWithClient = mediaClient.withMediaClient(
          mediaViewerModule.MediaViewer,
        );
        AsyncMediaViewer.MediaViewer = MediaViewerWithClient;
        AsyncMediaViewer.MediaViewerErrorBoundary =
          mediaViewerErrorBoundaryModule.default;

        this.setState({
          MediaViewer: MediaViewerWithClient,
          MediaViewerErrorBoundary: AsyncMediaViewer.MediaViewerErrorBoundary,
        });
      } catch (error) {
        // TODO [MS-2277]: Add operational error to catch async import error
      }
    }
  }

  render() {
    const { MediaViewer, MediaViewerErrorBoundary } = this.state;
    if (!MediaViewer || !MediaViewerErrorBoundary) {
      return (
        <ModalSpinner blankedColor={colors.DN30} invertSpinnerColor={true} />
      );
    }

    return (
      <MediaViewerErrorBoundary>
        <MediaViewer {...this.props} />
      </MediaViewerErrorBoundary>
    );
  }
}
