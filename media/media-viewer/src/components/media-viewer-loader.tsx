import React, { lazy, Suspense } from 'react';
import ModalSpinner from '../viewers/modalSpinner';
import type { MediaViewerWithMediaClientConfigProps } from './types';
import { MediaViewerPortal } from './portal';

const MediaViewer = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_media-viewer" */ './media-viewer-error-boundary'
	).then(({ MediaViewerWithErrorBoundary }) => ({ default: MediaViewerWithErrorBoundary })),
);

export default function AsyncMediaViewer(props: MediaViewerWithMediaClientConfigProps) {
	return (
		<Suspense fallback={<ModalSpinner />}>
			<MediaViewerPortal>
				<MediaViewer {...props} />
			</MediaViewerPortal>
		</Suspense>
	);
}
