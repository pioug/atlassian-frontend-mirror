import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { MediaViewerWithMediaClient } from './media-viewer-with-media-client';
import { type MediaViewerWithMediaClientConfigProps } from './types';

export const MediaViewerWithErrorBoundary = (
	props: MediaViewerWithMediaClientConfigProps,
): React.JSX.Element => (
	<ErrorBoundary FallbackComponent={() => null}>
		<MediaViewerWithMediaClient {...props} />
	</ErrorBoundary>
);
