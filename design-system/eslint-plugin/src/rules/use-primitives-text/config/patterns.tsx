export type Pattern = (typeof PATTERNS)[number];

export const PATTERNS: string[] = [
	// <p>text</p>
	'paragraph-elements',
	// <span>text</span>
	'span-elements',
	// <strong>text</strong>
	'strong-elements',
	// <em>text</em>
	'emphasis-elements',
];
