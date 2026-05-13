import type { RuleConfig } from './types';

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
