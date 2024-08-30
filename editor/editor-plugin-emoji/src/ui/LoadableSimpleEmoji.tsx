import Loadable from 'react-loadable';

import { type SimpleEmojiPlaceholderProps, type SimpleEmojiProps } from './SimpleEmoji';

export const LoadableSimpleEmoji = Loadable({
	loader: (): Promise<React.ComponentType<React.PropsWithChildren<SimpleEmojiProps>>> =>
		import(/* webpackChunkName: "@atlaskit-internal_simpleEmoji" */ './SimpleEmoji').then(
			(component) => component.SimpleEmoji,
		),
	loading: () => null,
});

export const LoadableSimpleEmojiPlaceholder = Loadable({
	loader: (): Promise<React.ComponentType<React.PropsWithChildren<SimpleEmojiPlaceholderProps>>> =>
		import(/* webpackChunkName: "@atlaskit-internal_simpleEmoji" */ './SimpleEmoji').then(
			(component) => component.SimpleEmojiPlaceholder,
		),
	loading: () => null,
});
