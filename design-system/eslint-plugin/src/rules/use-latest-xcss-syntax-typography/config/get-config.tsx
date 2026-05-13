import { PATTERNS } from './patterns';
import type { RuleConfig } from './types';

const defaults: RuleConfig = {
	failSilently: false,
	patterns: [...PATTERNS],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
