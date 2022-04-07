import React, { FC, useMemo } from 'react';
import { EmojiContext, EmojiContextType } from './EmojiContext';

type EmojiContextProviderType = {
  emojiContextValue: EmojiContextType;
};

export const EmojiContextProvider: FC<EmojiContextProviderType> = ({
  children,
  emojiContextValue,
}) => {
  const memoizedEmojiContextValue = useMemo(() => emojiContextValue, [
    emojiContextValue,
  ]);

  return (
    <EmojiContext.Provider value={memoizedEmojiContextValue}>
      {children}
    </EmojiContext.Provider>
  );
};
