import React from 'react';
import { type CardWithMediaClientConfigProps } from './types';
import UFOSegment from '@atlaskit/react-ufo/segment';
import { CardWithMediaClient } from './cardWithMediaClient';

const MediaCardContext = React.createContext({});

type CardSyncComponent = React.FC<CardWithMediaClientConfigProps>;

const CardSync: CardSyncComponent = (props) => {
	return (
		<UFOSegment name="media-card-sync" mode="list">
			<MediaCardContext.Provider value={props}>
				<CardWithMediaClient {...props} />
			</MediaCardContext.Provider>
		</UFOSegment>
	);
};

export default CardSync;
