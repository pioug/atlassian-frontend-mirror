type Pattern =
	// <h1>text</h1>
	'native-elements';

export interface RuleConfig {
	patterns: Pattern[];
	enableUnsafeAutofix: false;
}

const defaults: RuleConfig = {
	patterns: ['native-elements'],
	enableUnsafeAutofix: false,
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
