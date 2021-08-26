import React from 'react';
import { ArchiveViewerProps } from './types';
import ErrorMessage from '../../errorMessage';
import { MediaViewerError } from '../../errors';
import { DN30 } from '@atlaskit/theme/colors';
import ModalSpinner from '@atlaskit/media-ui/modalSpinner';

export type archiveViewerState = {
  ArchiveViewer?: React.ComponentType<ArchiveViewerProps>;
  isErrored: boolean;
};

export default class ArchiveViewerLoader extends React.PureComponent<
  ArchiveViewerProps
> {
  static ArchiveViewer?: React.ComponentType<ArchiveViewerProps>;
  state: archiveViewerState = {
    ArchiveViewer: ArchiveViewerLoader.ArchiveViewer,
    isErrored: false,
  };
  async componentDidMount() {
    if (!this.state.ArchiveViewer) {
      try {
        const archive = await import(
          /* webpackChunkName: "@atlaskit-internal_media-archive-viewer" */ './archive'
        );
        ArchiveViewerLoader.ArchiveViewer = archive.ArchiveViewer;

        this.setState({
          ArchiveViewer: ArchiveViewerLoader.ArchiveViewer,
        });
      } catch (error) {
        this.setState({ isErrored: true });
      }
    }
  }

  render() {
    const { ArchiveViewer, isErrored } = this.state;
    const { item } = this.props;

    if (isErrored) {
      return (
        <ErrorMessage
          fileId={item.id}
          fileState={item}
          error={new MediaViewerError('archiveviewer-bundle-loader')}
        />
      );
    }
    if (ArchiveViewer) {
      return <ArchiveViewer {...this.props} />;
    } else {
      return <ModalSpinner blankedColor={DN30} invertSpinnerColor={true} />;
    }
  }
}
