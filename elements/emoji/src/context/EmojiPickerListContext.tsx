import React, { createContext, type FC, useState } from 'react';
import type { EmojiPickerListContextType } from '../components/common/internal-types';

export const EmojiPickerListContext = createContext<EmojiPickerListContextType>(
  {
    currentEmojisFocus: { rowIndex: 0, columnIndex: 0 },
    setEmojisFocus: () => {},
  },
);

export interface EmojiPickerListContextProviderProps {
  initialEmojisFocus: {
    rowIndex: number;
    columnIndex: number;
  };
}

export const EmojiPickerListContextProvider: FC<
  EmojiPickerListContextProviderProps
> = (props) => {
  const [currentEmojisFocus, setEmojisFocus] = useState(
    props.initialEmojisFocus,
  );
  return (
    <EmojiPickerListContext.Provider
      value={{ currentEmojisFocus, setEmojisFocus }}
    >
      {props.children}
    </EmojiPickerListContext.Provider>
  );
};
