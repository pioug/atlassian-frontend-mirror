import React, { Suspense, useContext } from 'react';
import Loadable from 'react-loadable';
import { fg } from '@atlaskit/platform-feature-flags';
import { CardLoading } from '../utils/lightCards/cardLoading';
import { type CardWithMediaClientConfigProps } from './types';
import UFOSegment from '@atlaskit/react-ufo/segment';

const MediaCardContext = React.createContext({});

const CardLoadingWithContext = () => {
	const props = useContext(MediaCardContext);
	return <CardLoading {...props} interactionName="media-card-async-loading" />;
};

function loadCardWithMediaClient() {
	return import(
		/* webpackChunkName: "@atlaskit-internal_media-card-with-media-client" */ './cardWithMediaClient'
	);
}

const MediaCardWithMediaClientLoadable = Loadable({
	loader: (): Promise<React.ComponentType<CardWithMediaClientConfigProps>> =>
		loadCardWithMediaClient().then((mod) => mod.CardWithMediaClient),
	loading: () => <CardLoadingWithContext />,
});

const MediaCardWithMediaClientLazy = React.lazy(() =>
	loadCardWithMediaClient().then((mod) => ({ default: mod.CardWithMediaClient })),
);

const CardLoader: {
    (props: CardWithMediaClientConfigProps): React.JSX.Element;
    preload(): void;
} = (props: CardWithMediaClientConfigProps): React.JSX.Element => {
	return (
		<UFOSegment name="media-card" mode="list">
			<MediaCardContext.Provider value={props}>
				{fg('platform_media_react19_support') ? (
					<Suspense fallback={<CardLoadingWithContext />}>
						<MediaCardWithMediaClientLazy {...props} />
					</Suspense>
				) : (
					<MediaCardWithMediaClientLoadable {...props} />
				)}
			</MediaCardContext.Provider>
		</UFOSegment>
	);
};

CardLoader.preload = (): void => {
	if (fg('platform_media_react19_support')) {
		loadCardWithMediaClient().then(() => {});
	} else {
		MediaCardWithMediaClientLoadable.preload?.();
	}
};

export default CardLoader;
