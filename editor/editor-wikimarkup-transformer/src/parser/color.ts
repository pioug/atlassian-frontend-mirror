import { normalizeHexColor } from '@atlaskit/adf-schema/normalize-hex-color';

export function getEditorColor(attrs: { [key: string]: string }): string | null {
	const keys = Object.keys(attrs);
	return normalizeHexColor(keys[0]);
}
