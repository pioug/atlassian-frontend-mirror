type Pattern = 'restricted-property' | 'wrapped-token-value' | 'restricted-capitalisation';

export interface RuleConfig {
	failSilently: boolean;
	patterns: Pattern[];
}

const defaults: RuleConfig = {
	failSilently: false,
	patterns: ['restricted-property', 'wrapped-token-value', 'restricted-capitalisation'],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
