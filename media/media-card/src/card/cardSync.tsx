import React from 'react';
import { type CardWithMediaClientConfigProps } from './types';
import UFOSegment from '@atlaskit/react-ufo/ufo-segment';
import { CardWithMediaClient } from './cardWithMediaClient';

type CardSyncComponent = React.FC<CardWithMediaClientConfigProps>;

const CardSync: CardSyncComponent = (props) => {
	return (
		<UFOSegment name="media-card-sync" mode="list">
			<CardWithMediaClient {...props} />
		</UFOSegment>
	);
};

export default CardSync;
