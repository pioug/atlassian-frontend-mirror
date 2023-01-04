import React, { FC, useMemo, useEffect } from 'react';
import { EmojiContext, EmojiContextType } from './EmojiContext';
import debug from '../util/logger';

type EmojiContextProviderType = {
  emojiContextValue: EmojiContextType;
};

export const EmojiContextProvider: FC<EmojiContextProviderType> = ({
  children,
  emojiContextValue,
}) => {
  const memoizedEmojiContextValue = useMemo(
    () => emojiContextValue,
    [emojiContextValue],
  );

  useEffect(() => {
    // trigger emoji fetching
    async function fetchEmojiProvider() {
      try {
        await memoizedEmojiContextValue?.emoji.emojiProvider.fetchEmojiProvider();
      } catch (error) {
        debug('fetchEmojiProvider error catched from outside', error);
      }
    }
    fetchEmojiProvider();
  }, [memoizedEmojiContextValue]);

  return (
    <EmojiContext.Provider value={memoizedEmojiContextValue}>
      {children}
    </EmojiContext.Provider>
  );
};
