import { getLanguageType } from './getLanguageType';

export function isCodeViewerItem(name: string, mimetype: string = 'unknown'): boolean {
	return getLanguageType(name, mimetype) !== null;
}
