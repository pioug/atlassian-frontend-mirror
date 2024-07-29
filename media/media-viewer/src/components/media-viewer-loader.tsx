import React, { lazy, Suspense } from 'react';
import ModalSpinner from '../viewers/modalSpinner';
import type { MediaViewerWithMediaClientConfigProps } from './types';

const MediaViewer = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_media-viewer" */ './media-viewer-error-boundary'
	).then(({ MediaViewerWithErrorBoundary }) => ({ default: MediaViewerWithErrorBoundary })),
);

export default function AsyncMediaViewer(props: MediaViewerWithMediaClientConfigProps) {
	return (
		<Suspense fallback={<ModalSpinner />}>
			<MediaViewer {...props} />
		</Suspense>
	);
}
