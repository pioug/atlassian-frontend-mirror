import React, { lazy, Suspense } from 'react';

import { loadMediaViewerChunk } from '../chunkLoaders';
import ModalSpinner from '../viewers/modalSpinner';
import { MediaViewerPortal } from './portal';
import type { MediaViewerWithMediaClientConfigProps } from './types';

const MediaViewer = lazy(() =>
	loadMediaViewerChunk().then(({ MediaViewerWithErrorBoundary }) => ({
		default: MediaViewerWithErrorBoundary,
	})),
);

export default function AsyncMediaViewer(
	props: MediaViewerWithMediaClientConfigProps,
): React.JSX.Element {
	return (
		<Suspense fallback={<ModalSpinner />}>
			<MediaViewerPortal>
				<MediaViewer {...props} />
			</MediaViewerPortal>
		</Suspense>
	);
}
