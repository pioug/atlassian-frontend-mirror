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
	editorView,
}: RenderImageEditorProps) => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isSaving, setIsSaving] = useState<boolean>(false);

	useEffect(() => {
		const getImageUrl = () => {
			if (isExternalMedia(selectedNodeAttrs)) {
				// Fall back in case editing button shows by mistake
				onClose();
				errorReporter?.captureException(
					new Error('Cannot edit external media due to CORS restrictions'),
				);
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
	}, [selectedNodeAttrs, mediaClientConfig, errorReporter, onClose]);

	const handleSave = (blob: Blob, width: number, height: number) => {
		const mediaClient = new MediaClient(mediaClientConfig);
		const collection = 'collection' in selectedNodeAttrs ? selectedNodeAttrs.collection || '' : '';

		// Ensure blob has MIME type
		const typedBlob = blob.type ? blob : new Blob([blob], { type: 'image/png' });
		const localId = !isExternalMedia(selectedNodeAttrs) ? selectedNodeAttrs.localId : undefined;

		// Upload the edited image as a new file with a different filename
		const originalFileName = !isExternalMedia(selectedNodeAttrs)
			? selectedNodeAttrs.__fileName
			: undefined;
		let editedFileName = 'edited-image.png'; // fallback if the filename doesn't exist
		if (originalFileName) {
			const lastDotIndex = originalFileName.lastIndexOf('.');
			if (lastDotIndex > 0) {
				const baseName = originalFileName.substring(0, lastDotIndex);
				editedFileName = `${baseName}-edited-${localId}`;
			} else {
				editedFileName = `${originalFileName}-edited-${localId}`;
			}
		}

		const uploadableFile = {
			content: typedBlob,
			collection,
			mimeType: typedBlob.type,
			name: editedFileName,
			size: typedBlob.size,
		};
		// Show saving state in modal
		setIsSaving(true);

		const uploadSubscription = mediaClient.file.upload(uploadableFile).subscribe({
			next: (fileState) => {
				if (fileState.status === 'error') {
					setIsSaving(false);
					onClose();
					uploadSubscription.unsubscribe();
					return;
				}

				// Only update document when upload is complete
				if (fileState.status !== 'uploading' && fileState.status !== 'processing') {
					const updatedAttrs: MediaADFAttrs = isExternalMedia(selectedNodeAttrs)
						? selectedNodeAttrs
						: {
								...selectedNodeAttrs,
								id: fileState.id,
								__fileName: fileState.name,
								__fileMimeType: fileState.mimeType,
								__fileSize: fileState.size,
								width,
								height,
							};

					// Find the media node position and update it
					const { state, dispatch } = editorView;
					const { doc } = state;

					let nodePos: number | null = null;
					const selectedLocalId = !isExternalMedia(selectedNodeAttrs)
						? selectedNodeAttrs.localId
						: undefined;

					doc.descendants((node, pos) => {
						if (isExternalMedia(selectedNodeAttrs)) {
							return true;
						}
						// Find by localId (unique per node instance)
						if (selectedLocalId && node.attrs.localId === selectedLocalId) {
							nodePos = pos;
							return false;
						}
						return true;
					});

					if (nodePos !== null) {
						const node = doc.nodeAt(nodePos);
						if (node) {
							const tr = state.tr.setNodeMarkup(nodePos, undefined, updatedAttrs);
							dispatch(tr);
						}
					}

					uploadSubscription.unsubscribe();
					setIsSaving(false);
					onClose();
				}
			},
			error: (error) => {
				if (errorReporter) {
					errorReporter.captureException(error instanceof Error ? error : new Error(String(error)));
				}
				uploadSubscription.unsubscribe();
				setIsSaving(false);
				onClose();
			},
		});
	};
	return (
		<ImageEditor
			isOpen={true}
			onClose={onClose}
			imageUrl={imageUrl}
			onSave={handleSave}
			errorReporter={errorReporter}
			isSaving={isSaving}
		/>
	);
};
