/**
 * @jsxRuntime classic
 * @jsx jsx
 */

export const isTrustedOrigin = (baseUrl: string, eventOrigin: string): boolean => {
	try {
		return new URL(baseUrl).origin === eventOrigin;
	} catch {
		return false;
	}
};
