import React from 'react';
import { PreviewImageWrapper, InfoWrapper } from './styled';
import { PreviewData } from './types';
import { Card } from '@atlaskit/media-card';
import { FileIdentifier } from '@atlaskit/media-client';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { Preview, ImagePreview } from '../src/types';

const mediaClientConfig = createUploadMediaClientConfig();

export class UploadPreview extends React.Component<PreviewData> {
  getPreviewInfo(preview: Preview): string | null {
    if ('scaleFactor' in preview) {
      const imgPreview = preview as ImagePreview;
      return `${imgPreview.dimensions.width} x ${imgPreview.dimensions.height} @${imgPreview.scaleFactor}x`;
    } else {
      return null;
    }
  }

  render() {
    const { fileId, preview } = this.props;

    const identifier: FileIdentifier = {
      id: fileId,
      mediaItemType: 'file',
    };

    return (
      <PreviewImageWrapper>
        <Card identifier={identifier} mediaClientConfig={mediaClientConfig} />
        {preview ? (
          <InfoWrapper>{this.getPreviewInfo(preview)}</InfoWrapper>
        ) : null}
      </PreviewImageWrapper>
    );
  }
}
