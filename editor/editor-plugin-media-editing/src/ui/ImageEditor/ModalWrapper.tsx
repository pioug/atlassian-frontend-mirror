import React, { useEffect, useState } from 'react';

import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { ErrorReporter } from '@atlaskit/editor-common/error-reporter';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MediaClientConfig } from '@atlaskit/media-client';
import { MediaClient } from '@atlaskit/media-client';

import { isExternalMedia } from '../../pm-plugins/utils';

import { ImageEditor } from './index';

interface RenderImageEditorProps {
	editorView: EditorView;
	errorReporter?: ErrorReporter;
	mediaClientConfig: MediaClientConfig;
	onClose: () => void;
	selectedNodeAttrs: MediaADFAttrs;
}

export const RenderImageEditor = ({
	mediaClientConfig,
	onClose,
	selectedNodeAttrs,
	errorReporter,
	editorView
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
					const subscription = mediaClient.file.getFileState(id, {
						collectionName: collection,
					}).subscribe((fileState) => {
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
						errorReporter.captureException(error instanceof Error ? error : new Error(String(error)));
					}
					setImageUrl('');
				}
			}
		};
		getImageUrl();
	}, [selectedNodeAttrs, mediaClientConfig, errorReporter]);

	const handleSave = (blob: Blob) => {
		const mediaClient = new MediaClient(mediaClientConfig);
		const collection = 'collection' in selectedNodeAttrs ? selectedNodeAttrs.collection || '' : '';
		
		// Upload the edited image as a new file
		const uploadSubscription = mediaClient.file.upload(
			{
				content: blob,
				collection,
			},
		)
				.subscribe({
					next: (fileState) => {
						if (fileState.status === 'error') {
							onClose();
							uploadSubscription.unsubscribe();
							return;
						}
						
						const updatedAttrs: MediaADFAttrs = isExternalMedia(selectedNodeAttrs)
							? selectedNodeAttrs
							: {
									...selectedNodeAttrs,
									id: fileState.id,
									__fileName: fileState.name,
									__fileMimeType: fileState.mimeType,
									__fileSize: fileState.size,
								};
						
						// Find the media node position and update it
						const { state, dispatch } = editorView;
						const { doc } = state;
						
						let nodePos: number | null = null;
						doc.descendants((node, pos) => {
							if (!isExternalMedia(selectedNodeAttrs) && node.attrs.id === selectedNodeAttrs.id) {
								nodePos = pos;
								return false;
							}
						});
						
						if (nodePos !== null) {
							const node = doc.nodeAt(nodePos);
							if (node) {
								const tr = state.tr.setNodeMarkup(nodePos, undefined, updatedAttrs);
								dispatch(tr);
							}
						}
						
						if (fileState.status !== 'uploading' && fileState.status !== 'processing') {
							onClose();
							uploadSubscription.unsubscribe();
					}
				},
				error: (error) => {
					if (errorReporter) {
						errorReporter.captureException(error instanceof Error ? error : new Error(String(error)));
					}
					onClose();
					uploadSubscription.unsubscribe();
				}
			});
	};	return (
		<ImageEditor isOpen={true} onClose={onClose} imageUrl={imageUrl} onSave={handleSave} errorReporter={errorReporter}/>
	);
};
