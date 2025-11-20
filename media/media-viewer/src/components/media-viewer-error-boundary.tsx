import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { type MediaViewerWithMediaClientConfigProps } from './types';
import { MediaViewerWithMediaClient } from './media-viewer';

export const MediaViewerWithErrorBoundary = (
	props: MediaViewerWithMediaClientConfigProps,
): React.JSX.Element => (
	<ErrorBoundary FallbackComponent={() => null}>
		<MediaViewerWithMediaClient {...props} />
	</ErrorBoundary>
);
