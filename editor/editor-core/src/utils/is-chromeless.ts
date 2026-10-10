import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';

export function isChromeless(appearance?: EditorAppearance): appearance is 'chromeless' {
	return appearance === 'chromeless';
}
