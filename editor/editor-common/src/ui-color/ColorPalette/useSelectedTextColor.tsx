import { useContext } from 'react';

import {
	SelectedTextColorContext,
	type SelectedTextColorContextValue,
} from './SelectedTextColorContext';

export const useSelectedTextColor = (): SelectedTextColorContextValue =>
	useContext(SelectedTextColorContext);
