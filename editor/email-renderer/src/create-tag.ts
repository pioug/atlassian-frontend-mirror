import { escapeHtmlString } from './escape-html-string';

export const createTag = (
	tagName: string,
	attrs?: { [key: string]: string | number | undefined },
	content?: string | null,
): string => {
	const attrsList: string[] = [];

	Object.keys(attrs || {}).forEach((key) => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const value = attrs![key];

		if (value === undefined) {
			return;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp, @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
		const attrValue = escapeHtmlString(String(value)).replace(/"/g, "'");

		attrsList.push(`${key}="${attrValue}"`);
	});

	const attrsSerialized = attrsList.length ? ` ${attrsList.join(' ')}` : '';

	return content
		? `<${tagName}${attrsSerialized}>${content}</${tagName}>`
		: `<${tagName}${attrsSerialized}/>`;
};
