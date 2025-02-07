export const PATTERNS = [
	// <p>text</p>
	'paragraph-elements',
	// <span>text</span>
	'span-elements',
	// <strong>text</strong>
	'strong-elements',
	// <em>text</em>
	'emphasis-elements',
];

type Pattern = (typeof PATTERNS)[number];

export interface RuleConfig {
	failSilently: boolean;
	patterns: Pattern[];
	inheritColor: boolean;
	enableUnsafeAutofix: boolean;
	enableUnsafeReport: boolean;
}

const defaults: RuleConfig = {
	failSilently: false,
	patterns: ['paragraph-elements', 'span-elements', 'strong-elements', 'emphasis-elements'],
	inheritColor: false,
	enableUnsafeAutofix: false,
	enableUnsafeReport: true,
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
