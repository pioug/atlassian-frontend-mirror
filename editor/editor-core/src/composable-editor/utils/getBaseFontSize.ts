import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
/**
 * @param appearance
 * @returns default font size if valid
 */
export function getBaseFontSize(
  appearance?: EditorAppearance,
): number | undefined {
  if (appearance === undefined) {
    return akEditorFullPageDefaultFontSize;
  }
  return !['comment', 'chromeless', 'mobile'].includes(appearance)
    ? akEditorFullPageDefaultFontSize
    : undefined;
}
