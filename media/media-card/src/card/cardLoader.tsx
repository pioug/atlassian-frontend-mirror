import React, { useContext } from 'react';
import Loadable from 'react-loadable';
import { CardLoading } from '../utils/lightCards/cardLoading';
import { type CardWithMediaClientConfigProps } from './types';
import UFOSegment from '@atlaskit/react-ufo/segment';

const MediaCardContext = React.createContext({});

const CardLoadingWithContext = () => {
	const props = useContext(MediaCardContext);
	return <CardLoading {...props} interactionName="media-card-async-loading" />;
};

const MediaCardWithMediaClientProvider = Loadable({
	loader: (): Promise<React.ComponentType<CardWithMediaClientConfigProps>> =>
		import(
			/* webpackChunkName: "@atlaskit-internal_media-card-with-media-client" */ './cardWithMediaClient'
		).then((mod) => mod.CardWithMediaClient),
	loading: () => <CardLoadingWithContext />,
});

type CardLoaderComponent = React.FC<CardWithMediaClientConfigProps> & {
	preload: () => void;
};

const CardLoader: CardLoaderComponent = (props) => {
	return (
		<UFOSegment name="media-card" mode="list">
			<MediaCardContext.Provider value={props}>
				<MediaCardWithMediaClientProvider {...props} />
			</MediaCardContext.Provider>
		</UFOSegment>
	);
};

CardLoader.preload = () => MediaCardWithMediaClientProvider.preload();

export default CardLoader;
