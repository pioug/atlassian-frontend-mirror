import { useMemo } from 'react';
import { EditorAppearance } from '../editor-configuration';

export function useRemountKey(
  apperanceMode: EditorAppearance,
  locale: string,
): string {
  return useMemo(() => {
    return locale.replace('_', '-') + '-' + apperanceMode;
  }, [apperanceMode, locale]);
}
