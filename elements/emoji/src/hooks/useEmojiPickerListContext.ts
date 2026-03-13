import { useContext } from 'react';

import { EmojiPickerListContext } from '../context/EmojiPickerListContext';
import type { EmojiPickerListContextType } from '../components/common/internal-types';

export const useEmojiPickerListContext = (): EmojiPickerListContextType =>
	useContext(EmojiPickerListContext);
