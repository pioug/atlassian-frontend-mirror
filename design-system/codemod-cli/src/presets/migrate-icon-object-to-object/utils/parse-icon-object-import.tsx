/* eslint-disable @repo/internal/fs/filename-pattern-match */

import { AVAILABLE_ICON_NAMES } from './constants';

export function parseIconObjectImport(importPath: string): {
	iconName: string;
	size: '16' | '24';
} | null {
	const match = importPath.match(/^@atlaskit\/icon-object\/glyph\/([^/]+)\/(16|24)$/);
	if (!match) {
		return null;
	}

	const [, iconName, size] = match;

	// Check if this is a valid icon name we support
	if (!AVAILABLE_ICON_NAMES.includes(iconName)) {
		return null;
	}

	return {
		iconName,
		size: size as '16' | '24',
	};
}
