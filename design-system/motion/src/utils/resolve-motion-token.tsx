import { getDocument } from '@atlaskit/browser-apis';

/**
 * Resolves a motion token to a string value.
 * @param token - The motion token to resolve.
 * @returns The string value for the motion token.
 */
export const resolveMotionToken = (token: string): string => {
	const cssVarMatch = token.match(/var\(\s*(--[^,\s)]+)/);
	const cssVar = cssVarMatch ? cssVarMatch[1] : null;
	if (cssVar) {
		const documentElement = getDocument()?.documentElement;
		if (documentElement) {
			return getComputedStyle(documentElement).getPropertyValue(cssVar);
		}
	}
	return '';
};
