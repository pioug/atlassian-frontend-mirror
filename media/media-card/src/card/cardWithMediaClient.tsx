import React from 'react';
import { withMediaClientAndSettings, withMediaClient } from '@atlaskit/media-client-react';
import MediaCardAnalyticsErrorBoundary from './media-card-analytics-error-boundary';
import { Card as InternalCard } from './card';
import { type CardWithMediaClientConfigProps } from './types';
import { fg } from '@atlaskit/platform-feature-flags';

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
