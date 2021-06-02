import React from 'react';
import { UploadPreview } from './upload-preview';
import {
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadErrorEventPayload,
} from '../src/types';
import {
  PreviewsTitle,
  PreviewsWrapper,
  UploadPreviewsFlexRow,
} from './styled';
import { PreviewData } from './types';

export interface PreviewsDataState {
  previewsData: PreviewData[];
}

interface BrowserPickerCallbacks {
  onUploadsStart: (event: UploadsStartEventPayload) => void;
  onPreviewUpdate: (event: UploadPreviewUpdateEventPayload) => void;
  onError: (data: UploadErrorEventPayload) => void;
}

export interface PreviewsDataProps {
  children: (callbacks: BrowserPickerCallbacks) => React.ReactNode;
}

export class UploadPreviews extends React.Component<
  PreviewsDataProps,
  PreviewsDataState
> {
  state: PreviewsDataState = {
    previewsData: [],
  };

  onUploadsStart = (event: UploadsStartEventPayload) => {
    const { previewsData } = this.state;
    const { files } = event;

    const newPreviewData: PreviewData[] = files.map((file) => {
      const { id } = file;

      return {
        fileId: id,
      };
    });

    this.setState({
      previewsData: [...previewsData, ...newPreviewData],
    });
  };

  onPreviewUpdate = (data: UploadPreviewUpdateEventPayload) => {
    const { previewsData } = this.state;
    const currentItem = previewsData[previewsData.length - 1];
    currentItem.preview = data.preview;
    this.setState({
      previewsData: [...previewsData],
    });
  };

  onError = (data: UploadErrorEventPayload) => {
    console.log('upload error:', data);
  };

  render() {
    const { previewsData } = this.state;

    return (
      <PreviewsWrapper>
        <PreviewsTitle>Upload previews</PreviewsTitle>
        <div>
          {this.props.children({
            onUploadsStart: this.onUploadsStart,
            onError: this.onError,
            onPreviewUpdate: this.onPreviewUpdate,
          })}
        </div>
        <UploadPreviewsFlexRow>
          {previewsData.map((previewsData, index) => (
            <UploadPreview
              key={`${index}`}
              fileId={previewsData.fileId}
              preview={previewsData.preview}
            />
          ))}
        </UploadPreviewsFlexRow>
      </PreviewsWrapper>
    );
  }
}
