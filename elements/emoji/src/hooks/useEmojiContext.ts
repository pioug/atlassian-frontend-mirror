import { useContext } from 'react';

import { EmojiContext } from '../context/EmojiContext';

export const useEmojiContext = () => useContext(EmojiContext);
