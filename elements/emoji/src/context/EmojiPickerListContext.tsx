import React, { createContext, useState } from 'react';
import type { EmojiPickerListContextType } from '../components/common/internal-types';

export const EmojiPickerListContext = createContext<EmojiPickerListContextType>({
	currentEmojisFocus: { rowIndex: 0, columnIndex: 0 },
	setEmojisFocus: () => {},
});

export interface EmojiPickerListContextProviderProps {
	initialEmojisFocus: {
		columnIndex: number;
		rowIndex: number;
	};
}

export const EmojiPickerListContextProvider = (
	props: React.PropsWithChildren<EmojiPickerListContextProviderProps>,
) => {
	const [currentEmojisFocus, setEmojisFocus] = useState(props.initialEmojisFocus);
	return (
		<EmojiPickerListContext.Provider value={{ currentEmojisFocus, setEmojisFocus }}>
			{props.children}
		</EmojiPickerListContext.Provider>
	);
};
