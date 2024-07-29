type Pattern =
	// <h1>text</h1>
	'native-elements';

export interface RuleConfig {
	failSilently: boolean;
	patterns: Pattern[];
	enableUnsafeAutofix: false;
}

const defaults: RuleConfig = {
	failSilently: false,
	patterns: ['native-elements'],
	enableUnsafeAutofix: false,
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
