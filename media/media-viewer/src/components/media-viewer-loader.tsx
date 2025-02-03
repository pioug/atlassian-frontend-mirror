import React, { lazy, Suspense } from 'react';
import ModalSpinner from '../viewers/modalSpinner';
import type { MediaViewerWithMediaClientConfigProps } from './types';
import { MediaViewerPortal } from './portal';
import { fg } from '@atlaskit/platform-feature-flags';

const MediaViewer = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_media-viewer" */ './media-viewer-error-boundary'
	).then(({ MediaViewerWithErrorBoundary }) => ({ default: MediaViewerWithErrorBoundary })),
);

export default function AsyncMediaViewer(props: MediaViewerWithMediaClientConfigProps) {
	return (
		<Suspense fallback={<ModalSpinner />}>
			{fg('media_viewer_integrates_ds_portal') ? (
				<MediaViewerPortal>
					<MediaViewer {...props} />
				</MediaViewerPortal>
			) : (
				<MediaViewer {...props} />
			)}
		</Suspense>
	);
}
