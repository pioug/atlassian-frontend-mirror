import React, { type PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { type MediaViewerWithMediaClientConfigProps } from './types';
import { MediaViewerWithMediaClient } from './media-viewer';

export type MediaViewerAnalyticsErrorBoundaryProps = PropsWithChildren<{
	data?: { [k: string]: any };
}>;

export const MediaViewerWithErrorBoundary = (props: MediaViewerWithMediaClientConfigProps) => (
	<ErrorBoundary FallbackComponent={() => null}>
		<MediaViewerWithMediaClient {...props} />
	</ErrorBoundary>
);
