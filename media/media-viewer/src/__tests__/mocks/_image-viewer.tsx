import React from 'react';
import { MediaClient, ProcessedFileState } from '@atlaskit/media-client';
import {
  AnalyticViewerProps,
  ViewerLoadPayload,
} from '../../../src/newgen/analytics/item-viewer';

let _payload: ViewerLoadPayload = { status: 'success' };
export const setViewerPayload = (payload: ViewerLoadPayload) => {
  _payload = payload;
};

export type ImageViewerProps = AnalyticViewerProps & {
  mediaClient: MediaClient;
  item: ProcessedFileState;
  collectionName?: string;
  onClose?: () => void;
};

export class ImageViewer extends React.Component<ImageViewerProps, {}> {
  componentDidMount() {
    this.props.onLoad(_payload);
  }

  render() {
    return <div>so empty</div>;
  }
}
