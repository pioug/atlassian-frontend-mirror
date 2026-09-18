import { useContext } from 'react';

import type { EmojiPickerListContextType } from '../components/common/internal-types';
import { EmojiPickerListContext } from '../context/EmojiPickerListContext';

export const useEmojiPickerListContext = (): EmojiPickerListContextType =>
	useContext(EmojiPickerListContext);
