import React, { FC } from 'react';
import { EmojiContext, EmojiContextType } from './EmojiContext';

type EmojiContextProviderType = {
  emojiContextValue: EmojiContextType;
};

export const EmojiContextProvider: FC<EmojiContextProviderType> = ({
  children,
  emojiContextValue,
}) => {
  return (
    <EmojiContext.Provider value={emojiContextValue}>
      {children}
    </EmojiContext.Provider>
  );
};
