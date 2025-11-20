import React from 'react';
import { PreviewImageWrapper } from './stylesWrapper';
import { type PreviewData } from './types';
import { type FileIdentifier, MediaClient } from '@atlaskit/media-client';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { type Preview, type ImagePreview } from '../src/types';
import { NativeMediaViewer } from './NativeMediaViewer';

const mediaClientConfig = createUploadMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

export class UploadPreview extends React.Component<PreviewData> {
	getPreviewInfo(preview: Preview): string | null {
		if ('scaleFactor' in preview) {
			const imgPreview = preview as ImagePreview;
			return `${imgPreview.dimensions.width} x ${imgPreview.dimensions.height} @${imgPreview.scaleFactor}x`;
		} else {
			return null;
		}
	}

	render(): React.JSX.Element {
		const { fileId } = this.props;

		const identifier: FileIdentifier = {
			id: fileId,
			mediaItemType: 'file',
		};

		return (
			<PreviewImageWrapper>
				<NativeMediaViewer id={identifier.id} mediaClient={mediaClient} />
			</PreviewImageWrapper>
		);
	}
}
