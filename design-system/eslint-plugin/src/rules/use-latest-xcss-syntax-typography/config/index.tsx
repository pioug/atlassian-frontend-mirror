export const PATTERNS = [
	'restricted-property',
	'wrapped-token-value',
	'restricted-capitalisation',
] as const;
type Pattern = (typeof PATTERNS)[number];

export interface RuleConfig {
	failSilently: boolean;
	patterns: Pattern[];
}

const defaults: RuleConfig = {
	failSilently: false,
	patterns: [...PATTERNS],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
