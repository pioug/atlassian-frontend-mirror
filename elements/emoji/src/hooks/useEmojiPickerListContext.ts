import { useContext } from 'react';

import { EmojiPickerListContext } from '../context/EmojiPickerListContext';

export const useEmojiPickerListContext = () =>
  useContext(EmojiPickerListContext);
