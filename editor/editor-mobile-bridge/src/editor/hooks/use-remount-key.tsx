import { useMemo } from 'react';
import { type EditorAppearance } from '../editor-configuration';

export function useRemountKey(appearanceMode: EditorAppearance, locale: string): string {
	return useMemo(() => {
		return locale.replace('_', '-') + '-' + appearanceMode;
	}, [appearanceMode, locale]);
}
