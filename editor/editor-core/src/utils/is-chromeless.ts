import type { EditorAppearance } from '@atlaskit/editor-common/types';

export function isChromeless(appearance?: EditorAppearance) {
	return appearance === 'chromeless';
}
