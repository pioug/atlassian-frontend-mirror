import type { CategoryId } from '../components/picker/categories';
import type { EmojiDescription } from '../types';

export const getCategoryId = (emoji: EmojiDescription): CategoryId => emoji.category as CategoryId;
