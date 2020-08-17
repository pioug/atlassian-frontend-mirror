import React from 'react';
import { ArchiveViewerProps } from './types';
import ErrorMessage, { createError } from '../../error';
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
          /* webpackChunkName:"archive-viewer" */ './archive'
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

    if (isErrored) {
      return <ErrorMessage error={createError('previewFailed')} />;
    }
    if (ArchiveViewer) {
      return <ArchiveViewer {...this.props} />;
    } else {
      return <ModalSpinner blankedColor={DN30} invertSpinnerColor={true} />;
    }
  }
}
