import { createContext, type Context } from 'react';
import type { EmojiContext as InternalEmojiContextType } from '../components/common/internal-types';

export type EmojiContextType = InternalEmojiContextType | null;

export const EmojiContext: Context<EmojiContextType> = createContext<EmojiContextType>(null);
