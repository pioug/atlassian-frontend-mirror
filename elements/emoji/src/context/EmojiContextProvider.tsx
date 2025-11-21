import React, { useMemo, useEffect } from 'react';
import { EmojiContext, type EmojiContextType } from './EmojiContext';
import debug from '../util/logger';

type EmojiContextProviderType = {
	emojiContextValue: EmojiContextType;
};

export const EmojiContextProvider = ({
	children,
	emojiContextValue,
}: React.PropsWithChildren<EmojiContextProviderType>): React.JSX.Element => {
	const memoizedEmojiContextValue = useMemo(() => emojiContextValue, [emojiContextValue]);

	useEffect(() => {
		// trigger emoji fetching
		async function fetchEmojiProvider() {
			try {
				await memoizedEmojiContextValue?.emoji.emojiProvider.fetchEmojiProvider();
			} catch (error) {
				debug('fetchEmojiProvider error catched from outside', error);
			}
		}
		if (memoizedEmojiContextValue?.emoji.emojiProvider.onlyFetchOnDemand) {
			const isFetchingOnDemand = memoizedEmojiContextValue?.emoji.emojiProvider.onlyFetchOnDemand();
			if (!isFetchingOnDemand) {
				fetchEmojiProvider();
			}
		} else {
			fetchEmojiProvider();
		}
	}, [memoizedEmojiContextValue]);

	return (
		<EmojiContext.Provider value={memoizedEmojiContextValue}>{children}</EmojiContext.Provider>
	);
};
