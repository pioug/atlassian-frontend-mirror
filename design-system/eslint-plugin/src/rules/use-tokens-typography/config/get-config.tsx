/* eslint-disable @atlassian/tangerine/import/entry-points */

import type { RuleConfig } from './types';

const defaultConfig: RuleConfig = {
	failSilently: false,
	enableUnsafeAutofix: false,
	patterns: [
		'style-object',
		'font-weight',
		'font-family',
		'untokenized-properties',
		'banned-properties',
		'restricted-capitalisation',
	],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaultConfig, overrides);
};
