import React from 'react';

import type MediaButton from '@atlaskit/media-ui/MediaButton';

import { type DownloadButtonClickedEventPayload } from './analytics/events/ui/downloadButtonClicked';
import { type FailedPreviewDownloadButtonClickedEventPayload } from './analytics/events/ui/failedPreviewDownloadButtonClicked';

export type DownloadButtonProps = React.ComponentProps<typeof MediaButton> & {
	tooltip?: string;
	analyticspayload:
		| DownloadButtonClickedEventPayload
		| FailedPreviewDownloadButtonClickedEventPayload;
};
