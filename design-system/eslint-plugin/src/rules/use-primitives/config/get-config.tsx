import type { RuleConfig } from './types';

const defaults: RuleConfig = {
	patterns: ['compiled-css-function'],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
