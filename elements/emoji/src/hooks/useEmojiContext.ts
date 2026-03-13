import { useContext } from 'react';

import { EmojiContext, type EmojiContextType } from '../context/EmojiContext';

/**
 * @deprecated This hook can be replaced with useEmoji instead and will be deprecated in the near future
 */
export const useEmojiContext = (): EmojiContextType => useContext(EmojiContext);
