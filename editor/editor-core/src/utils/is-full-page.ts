import type { EditorAppearance } from '@atlaskit/editor-common/types';

export function isFullPage(appearance?: EditorAppearance) {
	return appearance === 'full-page' || appearance === 'full-width';
}
