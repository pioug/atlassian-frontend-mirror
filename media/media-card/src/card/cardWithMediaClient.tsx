import React from 'react';

import { withMediaClient } from '@atlaskit/media-client-react/with-media-client';
import { withMediaClientAndSettings } from '@atlaskit/media-client-react/with-media-client-and-settings';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { Card as InternalCard } from './card';
import MediaCardAnalyticsErrorBoundary from './media-card-analytics-error-boundary';
import { type CardWithMediaClientConfigProps } from './types';

export const CardWithMediaClient: React.FC<CardWithMediaClientConfigProps> = (props) => {
	const { dimensions, onClick } = props;
	const Card = React.useMemo(() => {
		if (fg('platform_media_video_captions')) {
			return withMediaClientAndSettings(InternalCard);
		}
		return withMediaClient(InternalCard);
	}, []);

	return (
		<MediaCardAnalyticsErrorBoundary dimensions={dimensions} onClick={onClick}>
			<Card {...props} />
		</MediaCardAnalyticsErrorBoundary>
	);
};
