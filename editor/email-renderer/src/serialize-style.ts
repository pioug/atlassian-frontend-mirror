import type { Style } from './interfaces';

export const serializeStyle = (style: Style): string => {
	return Object.keys(style).reduce((memo, key) => {
		if (style[key] === undefined) {
			return memo;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp, @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
		const value = String(style[key]).replace(/"/g, "'");
		return (memo += `${key}: ${value};`);
	}, '');
};
