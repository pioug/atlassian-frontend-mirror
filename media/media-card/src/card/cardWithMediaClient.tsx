import React from 'react';
import { withMediaClient } from '@atlaskit/media-client-react';
import MediaCardAnalyticsErrorBoundary from './media-card-analytics-error-boundary';
import { Card as InternalCard } from './card';
import { type CardWithMediaClientConfigProps } from './types';

export const CardWithMediaClient: React.FC<CardWithMediaClientConfigProps> = (props) => {
	const { dimensions, onClick } = props;
	const Card = React.useMemo(() => {
		return withMediaClient(InternalCard);
	}, []);

	return (
		<MediaCardAnalyticsErrorBoundary dimensions={dimensions} onClick={onClick}>
			<Card {...props} />
		</MediaCardAnalyticsErrorBoundary>
	);
};
