import { useContext } from 'react';

import { EmojiContext } from '../context/EmojiContext';

/**
 * @deprecated This hook can be replaced with useEmoji instead and will be deprecated in the near future
 */
export const useEmojiContext = () => useContext(EmojiContext);
