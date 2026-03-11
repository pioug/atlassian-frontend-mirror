import { getDocument } from '@atlaskit/browser-apis';
import { type Motion as MotionToken } from '@atlaskit/tokens/css-type-schema';

/**
 * Gets the duration in milliseconds for an animation property.
 * @param animation - The animation property to get the duration for.
 * @returns The duration in milliseconds.
 */
export const getDurationMs = (animation: string): number => {
    const match = animation.trim().match(/^(-?\d*\.?\d+)(ms|s)\b/);
    if (!match) {
        return 0;
    }
    const value = parseFloat(match[1]);
    const unit = match[2];
    return unit === 's' ? value * 1000 : value;
};

/**
 * Resolves a motion token to a string value.
 * @param token - The motion token to resolve.
 * @returns The string value for the motion token.
 */
export const resolveMotionToken = (token: MotionToken): string => {
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