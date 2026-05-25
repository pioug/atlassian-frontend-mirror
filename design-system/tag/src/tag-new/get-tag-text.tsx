// Intentionally scoped to the UI-uplifted TagNew implementation.
export const getTagText = (text: string | string[]): string =>
	Array.isArray(text) ? text.join('') : text;
