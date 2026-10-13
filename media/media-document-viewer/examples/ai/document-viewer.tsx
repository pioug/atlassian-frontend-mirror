import React, { useCallback, useId, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import { DocumentViewer } from '@atlaskit/media-document-viewer/document-viewer';
import { DOCUMENT_SCROLL_ROOT_ID } from '@atlaskit/media-document-viewer/get-document-root';
import { Anchor } from '@atlaskit/primitives/compiled/anchor';
import { Box } from '@atlaskit/primitives/compiled/box';

type DocumentPreviewProps = {
	mediaClient: MediaClient;
	fileId: string;
	documentName: string;
	originalFileUrl: string;
	collectionName?: string;
	onError: (error: unknown) => void;
};

const styles = cssMap({ container: { maxHeight: '80vh', overflow: 'auto' } });

export function DocumentPreview({
	mediaClient,
	fileId,
	documentName,
	originalFileUrl,
	collectionName,
	onError,
}: DocumentPreviewProps): React.JSX.Element {
	const id = useId();
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [attempt, setAttempt] = useState(0);

	const reportError = useCallback(
		(error: unknown) => {
			setHasError(true);
			onError(error);
		},
		[onError],
	);

	const getContent = useCallback(
		async (pageStart: number, pageEnd: number) => {
			try {
				return await mediaClient.mediaStore.getDocumentContent(fileId, {
					pageStart,
					pageEnd,
					collectionName,
				});
			} catch (error) {
				reportError(error);
				throw error;
			}
		},
		[collectionName, fileId, mediaClient, reportError],
	);

	const getPageImageUrl = useCallback(
		async (page: number, zoom: number) => {
			try {
				const image = await mediaClient.mediaStore.getDocumentPageImage(fileId, {
					page,
					zoom,
					collectionName,
				});
				// DocumentViewer caches these blob URLs and revokes them when it unmounts.
				return URL.createObjectURL(image);
			} catch (error) {
				reportError(error);
				throw error;
			}
		},
		[collectionName, fileId, mediaClient, reportError],
	);

	if (hasError) {
		return (
			<section role="alert" aria-labelledby={`${id}-error-title`}>
				<h2 id={`${id}-error-title`}>{documentName} preview unavailable</h2>
				<p>We couldn’t load this document preview.</p>
				<button
					type="button"
					onClick={() => {
						setHasError(false);
						setIsLoaded(false);
						setAttempt((current) => current + 1);
					}}
				>
					Retry preview
				</button>
				<p>
					<Anchor href={originalFileUrl} target="_blank" rel="noopener noreferrer">
						Open original document
					</Anchor>
				</p>
			</section>
		);
	}

	return (
		<section aria-labelledby={`${id}-title`}>
			<h2 id={`${id}-title`}>{documentName}</h2>
			{!isLoaded && <p role="status">Loading {documentName} preview…</p>}
			<Box
				id={DOCUMENT_SCROLL_ROOT_ID}
				role="region"
				aria-labelledby={`${id}-title`}
				tabIndex={0}
				xcss={styles.container}
			>
				<DocumentViewer
					key={attempt}
					getContent={getContent}
					getPageImageUrl={getPageImageUrl}
					zoom={1}
					onSuccess={() => setIsLoaded(true)}
				/>
			</Box>
		</section>
	);
}
