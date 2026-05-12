import { PAGE_LAYOUT_LS_KEY } from './constants';
import safeLocalStorage from './safe-local-storage';

export const getGridStateFromStorage = (key: string): any => {
	const storageValue = JSON.parse(safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}');

	return storageValue[key];
};
