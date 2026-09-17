/**
 * @jsxRuntime classic
 * @jsx jsx
 */

export const isSafeHttpsUrl = (url: string | undefined): url is string =>
	url ? new URL(url).protocol === 'https:' : false;
