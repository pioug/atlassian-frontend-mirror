import { PAGE_LAYOUT_LS_KEY } from './constants';
import safeLocalStorage from './safe-local-storage';

export const mergeGridStateIntoStorage = (key: string, value: any): void => {
	const storageValue = JSON.parse(safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}');

	if (value !== null && typeof value === 'object') {
		storageValue[key] = { ...storageValue[key], ...value };
	} else {
		storageValue[key] = value;
	}

	safeLocalStorage().setItem(PAGE_LAYOUT_LS_KEY, JSON.stringify(storageValue));
};
