import React, { FC, useMemo, useEffect } from 'react';
import { EmojiContext, EmojiContextType } from './EmojiContext';

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
      await memoizedEmojiContextValue?.emoji.emojiProvider.fetchEmojiProvider();
    }
    fetchEmojiProvider();
  }, [memoizedEmojiContextValue]);

  return (
    <EmojiContext.Provider value={memoizedEmojiContextValue}>
      {children}
    </EmojiContext.Provider>
  );
};
