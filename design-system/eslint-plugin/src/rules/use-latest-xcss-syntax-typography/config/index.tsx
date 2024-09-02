type Pattern = 'restricted-property' | 'wrapped-token-value';

export interface RuleConfig {
	failSilently: boolean;
	patterns: Pattern[];
}

const defaults: RuleConfig = {
	failSilently: false,
	patterns: ['restricted-property', 'wrapped-token-value'],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
