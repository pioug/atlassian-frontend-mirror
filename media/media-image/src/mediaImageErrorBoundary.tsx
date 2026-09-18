import React, { type PropsWithChildren } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { MediaImageWithMediaClient } from './mediaImage';
import { type MediaImageWithMediaClientConfigProps } from './types';

export type MediaViewerAnalyticsErrorBoundaryProps = PropsWithChildren<{
	data?: { [k: string]: any };
}>;

export const MediaImageWithErrorBoundary = (
	props: MediaImageWithMediaClientConfigProps,
): React.JSX.Element => (
	<ErrorBoundary
		fallback={
			<>
				{props.children({
					loading: false,
					error: true,
				})}
			</>
		}
	>
		<MediaImageWithMediaClient {...props} />
	</ErrorBoundary>
);
