import { EditorAppearance } from '../types';

export function isFullPage(appearance?: EditorAppearance) {
  return appearance === 'full-page' || appearance === 'full-width';
}
