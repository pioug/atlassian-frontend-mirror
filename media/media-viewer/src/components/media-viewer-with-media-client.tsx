import React from 'react';

import { withMediaClient } from '@atlaskit/media-client-react/with-media-client';
import { withMediaClientAndSettings } from '@atlaskit/media-client-react/with-media-client-and-settings';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { MediaViewerBase } from './media-viewer-base';
import type { MediaViewerWithMediaClientConfigProps } from './types';

// Can't export in a single line. Typescript struggles to recognize the component signature in the error boundary test file ./media-viewer-error-boundary.test.tsx
// export const MediaViewerWithMediaClient = withMediaClient(MediaViewerBase)
export const MediaViewerWithMediaClient = (
	props: MediaViewerWithMediaClientConfigProps,
): React.JSX.Element => {
	const ViewerComponent = React.useMemo(() => {
		if (fg('platform_media_video_captions')) {
			return withMediaClientAndSettings(MediaViewerBase);
		}
		return withMediaClient(MediaViewerBase);
	}, []);

	return <ViewerComponent {...props} />;
};
