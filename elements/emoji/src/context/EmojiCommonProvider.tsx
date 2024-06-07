import React from 'react';
import type { EmojiProvider } from '../api/EmojiResource';
import { EmojiContextProvider } from './EmojiContextProvider';

export interface EmojiCommonProviderProps {
	/**
	 * emojiProvider is an instance of a class that implements an EmojiProvider interface (e.g. instance of the EmojiResource)
	 */
	emojiProvider?: EmojiProvider;
}

/**
 * EmojiCommonProvider will provide emojiProvider to children,
 * which will be used to access Emoji Resource to find emoji, filter emoji, check if upload is supported, etc.
 *
 * Example usage:
 * const emojiResource = new EmojiResource(resourceConfig)
 * <EmojiCommonProvider emojiProvider={emojiResource} />
 */
export const EmojiCommonProvider = (props: React.PropsWithChildren<EmojiCommonProviderProps>) => {
	if (props.emojiProvider) {
		return (
			<EmojiContextProvider
				emojiContextValue={{
					emoji: {
						emojiProvider: props.emojiProvider,
					},
				}}
			>
				{props.children}
			</EmojiContextProvider>
		);
	}
	return <>{props.children}</>;
};
