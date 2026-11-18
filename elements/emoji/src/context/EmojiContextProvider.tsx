import React, { useMemo, useEffect } from 'react';

import debug from '../util/logger';
import { EmojiContext, type EmojiContextType } from './EmojiContext';

type EmojiContextProviderType = {
	emojiContextValue: EmojiContextType;
};

export const EmojiContextProvider = ({
	children,
	emojiContextValue,
}: React.PropsWithChildren<EmojiContextProviderType>): React.JSX.Element => {
	const memoizedEmojiContextValue = useMemo(() => emojiContextValue, [emojiContextValue]);
	const emojiProvider = memoizedEmojiContextValue?.emoji.emojiProvider;

	useEffect(() => {
		if (!emojiProvider) {
			return;
		}
		// trigger emoji fetching
		const fetchEmojiProvider = async () => {
			try {
				await emojiProvider.fetchEmojiProvider();
			} catch (error) {
				debug('fetchEmojiProvider error catched from outside', error);
			}
		};
		if (emojiProvider.onlyFetchOnDemand) {
			const isFetchingOnDemand = emojiProvider.onlyFetchOnDemand();
			if (!isFetchingOnDemand) {
				fetchEmojiProvider();
			}
		} else {
			fetchEmojiProvider();
		}
	}, [emojiProvider]);

	return (
		<EmojiContext.Provider value={memoizedEmojiContextValue}>{children}</EmojiContext.Provider>
	);
};
