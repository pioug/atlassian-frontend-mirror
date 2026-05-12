import { PAGE_LAYOUT_LS_KEY } from './constants';
import safeLocalStorage from './safe-local-storage';

export const removeFromGridStateInStorage = (key: string, secondKey?: string): void => {
	const storageValue = JSON.parse(safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}');

	if (secondKey && storageValue[key]) {
		delete storageValue[key][secondKey];
	} else {
		delete storageValue[key];
	}

	safeLocalStorage().setItem(PAGE_LAYOUT_LS_KEY, JSON.stringify(storageValue));
};
