import React from 'react';

import type MediaButton from '@atlaskit/media-ui/MediaButton';

import { type DownloadButtonClickedEventPayload } from './analytics/events/ui/downloadButtonClicked';
import { type FailedPreviewDownloadButtonClickedEventPayload } from './analytics/events/ui/failedPreviewDownloadButtonClicked';

export type DownloadButtonProps = React.ComponentProps<typeof MediaButton> & {
	tooltip?: string;
	// The inset viewer's buttons follow the theme and take only the test id, disabled state and click
	// handler, plus the text for `insetText`. `default` is the media button, which takes all the other props.
	variant?: 'default' | 'insetIcon' | 'insetText';
	analyticspayload:
		| DownloadButtonClickedEventPayload
		| FailedPreviewDownloadButtonClickedEventPayload;
};
