import React, { useContext } from 'react';
import Loadable from 'react-loadable';
import { CardLoading } from '../utils/lightCards/cardLoading';
import type { CardWithMediaClientConfigProps } from './types';
const MediaCardContext = React.createContext({});

const CardLoadingWithContext: React.FC<{}> = () => {
	const props = useContext(MediaCardContext);
	return <CardLoading {...props} />;
};
const MediaCardWithMediaClient = Loadable({
	loader: (): Promise<React.ComponentType<CardWithMediaClientConfigProps>> =>
		import(
			/* webpackChunkName: "@atlaskit-internal_media-card-with-media-client" */ './cardWithMediaClient'
		).then((mod) => mod.CardWithMediaClient),
	loading: () => <CardLoadingWithContext />,
});

const CardLoader: React.FC<CardWithMediaClientConfigProps> = (props) => {
	return (
		<MediaCardContext.Provider value={props}>
			<MediaCardWithMediaClient {...props} />
		</MediaCardContext.Provider>
	);
};

export default CardLoader;
