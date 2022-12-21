import React from 'react';
import { ModalSpinner } from '@atlaskit/media-ui';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';

import { MediaViewerProps } from './types';
import { MediaViewerAnalyticsErrorBoundaryProps } from './media-viewer-analytics-error-boundary';
import { headerAndSidebarBackgroundColor } from '../styles';
import withThemeObserverHOC from '../viewers/useThemeObserverHoc';

export type MediaViewerWithMediaClientConfigProps =
  WithMediaClientConfigProps<MediaViewerProps>;

type MediaViewerWithMediaClientConfigComponent =
  React.ComponentType<MediaViewerWithMediaClientConfigProps>;

type MediaViewerErrorBoundaryComponent =
  React.ComponentType<MediaViewerAnalyticsErrorBoundaryProps>;

export interface AsyncMediaViewerState {
  MediaViewer?: MediaViewerWithMediaClientConfigComponent;
  MediaViewerErrorBoundary?: MediaViewerErrorBoundaryComponent;
}

export class AsyncMediaViewer extends React.PureComponent<
  MediaViewerWithMediaClientConfigProps &
    AsyncMediaViewerState & { theme: 'light' | 'dark' | 'none' },
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
        const [mediaClient, mediaViewerModule, mediaViewerErrorBoundaryModule] =
          await Promise.all([
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
    const { theme } = this.props;
    const { MediaViewer, MediaViewerErrorBoundary } = this.state;
    if (!MediaViewer || !MediaViewerErrorBoundary) {
      return (
        <ModalSpinner
          blankedColor={headerAndSidebarBackgroundColor}
          invertSpinnerColor={theme !== 'dark'}
        />
      );
    }

    return (
      <MediaViewerErrorBoundary>
        <MediaViewer {...this.props} />
      </MediaViewerErrorBoundary>
    );
  }
}

export default withThemeObserverHOC(AsyncMediaViewer);
