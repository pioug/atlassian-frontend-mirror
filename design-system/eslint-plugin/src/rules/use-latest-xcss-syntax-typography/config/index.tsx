export interface RuleConfig {
	failSilently: boolean;
}

const defaults: RuleConfig = {
	failSilently: false,
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
