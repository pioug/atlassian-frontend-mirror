import React from 'react';

import type { EmojiProvider } from '../../api/EmojiResource';
import LoadingEmojiComponent, { type State as LoadingState } from '../common/LoadingEmojiComponent';
import type { Props as ComponentProps } from './EmojiUploadComponent';
import type { Props } from './EmojiUploader';

const emojiUploadModuleLoader = () =>
	import(/* webpackChunkName:"@atlaskit-internal_emojiUploadComponent" */ './EmojiUploadComponent');

const emojiUploadLoader: () => Promise<
	React.ComponentType<React.PropsWithChildren<ComponentProps>>
> = () => emojiUploadModuleLoader().then((module) => module.default);

export class EmojiUploaderInternal extends LoadingEmojiComponent<Props, LoadingState> {
	// state initialised with static component to prevent
	// rerender when the module has already been loaded
	static AsyncLoadedComponent?: React.ComponentType<React.PropsWithChildren<ComponentProps>>;
	state: {
		asyncLoadedComponent: React.ComponentType<React.PropsWithChildren<ComponentProps>> | undefined;
	} = {
		asyncLoadedComponent: EmojiUploaderInternal.AsyncLoadedComponent,
	};

	constructor(props: Props) {
		super(props, {});
	}

	asyncLoadComponent(): void {
		emojiUploadLoader().then((component) => {
			EmojiUploaderInternal.AsyncLoadedComponent = component;
			this.setAsyncState(component);
		});
	}

	renderLoaded(
		loadedEmojiProvider: EmojiProvider,
		EmojiUploadComponent: React.ComponentType<React.PropsWithChildren<ComponentProps>>,
	): React.JSX.Element {
		const { emojiProvider, ...otherProps } = this.props;
		return <EmojiUploadComponent emojiProvider={loadedEmojiProvider} {...otherProps} />;
	}
}
