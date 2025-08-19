import React from 'react';

import LoadingEmojiComponent, {
	type Props as LoadingProps,
	type State as LoadingState,
} from '../common/LoadingEmojiComponent';
import type { Props as ComponentProps } from './EmojiUploadComponent';
import type { EmojiProvider } from '../../api/EmojiResource';
import { type CreateUIAnalyticsEvent, withAnalyticsEvents } from '@atlaskit/analytics-next';

const emojiUploadModuleLoader = () =>
	import(/* webpackChunkName:"@atlaskit-internal_emojiUploadComponent" */ './EmojiUploadComponent');

const emojiUploadLoader: () => Promise<
	React.ComponentType<React.PropsWithChildren<ComponentProps>>
> = () => emojiUploadModuleLoader().then((module) => module.default);

export interface Props extends LoadingProps {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	disableFocusLock?: boolean;
}

export class EmojiUploaderInternal extends LoadingEmojiComponent<Props, LoadingState> {
	// state initialised with static component to prevent
	// rerender when the module has already been loaded
	static AsyncLoadedComponent?: React.ComponentType<React.PropsWithChildren<ComponentProps>>;
	state = {
		asyncLoadedComponent: EmojiUploaderInternal.AsyncLoadedComponent,
	};

	constructor(props: Props) {
		super(props, {});
	}

	asyncLoadComponent() {
		emojiUploadLoader().then((component) => {
			EmojiUploaderInternal.AsyncLoadedComponent = component;
			this.setAsyncState(component);
		});
	}

	renderLoaded(
		loadedEmojiProvider: EmojiProvider,
		EmojiUploadComponent: React.ComponentType<React.PropsWithChildren<ComponentProps>>,
	) {
		const { emojiProvider, ...otherProps } = this.props;
		return <EmojiUploadComponent emojiProvider={loadedEmojiProvider} {...otherProps} />;
	}
}

type EmojiUploader = EmojiUploaderInternal;
const EmojiUploader = withAnalyticsEvents()(EmojiUploaderInternal);

export default EmojiUploader;
