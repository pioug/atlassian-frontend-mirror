import React, { useEffect, useState } from 'react';

import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { ErrorReporter } from '@atlaskit/editor-common/error-reporter';
import type { MediaClientConfig } from '@atlaskit/media-client';
import { MediaClient } from '@atlaskit/media-client';

import { isExternalMedia } from '../../pm-plugins/utils';

import { ImageEditor } from './index';

interface RenderImageEditorProps {
	errorReporter?: ErrorReporter;
	mediaClientConfig: MediaClientConfig;
	onClose: () => void;
	onSave?: (updatedAttrs: MediaADFAttrs) => void;
	selectedNodeAttrs: MediaADFAttrs;
}

export const RenderImageEditor = ({
	mediaClientConfig,
	onClose,
	selectedNodeAttrs,
	errorReporter,
	// TODO: EDITOR-3779 - To implement saving image
	// eslint-disable-next-line
	onSave,
}: RenderImageEditorProps) => {
	const [imageUrl, setImageUrl] = useState<string>('');

	useEffect(() => {
		const getImageUrl = () => {
			if (isExternalMedia(selectedNodeAttrs)) {
				// External image - use the URL directly
				setImageUrl(selectedNodeAttrs.url || '');
			} else {
				// File media - use MediaClient to get the image URL
				const { id, collection = '' } = selectedNodeAttrs;
				try {
					const mediaClient = new MediaClient(mediaClientConfig);

					// Subscribe to file state to get file information
					const subscription = mediaClient.file
						.getFileState(id, {
							collectionName: collection,
						})
						.subscribe((fileState) => {
							if (fileState.status === 'processed' || fileState.status === 'processing') {
								// Get the image URL from the processed file
								mediaClient.file.getFileBinaryURL(id, collection).then((url) => {
									setImageUrl(url);
								});
							}
						});

					// Cleanup subscription on unmount
					return () => subscription.unsubscribe();
				} catch (error) {
					if (errorReporter) {
						errorReporter.captureException(
							error instanceof Error ? error : new Error(String(error)),
						);
					}
					setImageUrl('');
				}
			}
		};
		getImageUrl();
	}, [selectedNodeAttrs, mediaClientConfig, errorReporter]);

	return <ImageEditor isOpen={true} onClose={onClose} imageUrl={imageUrl} />;
};
