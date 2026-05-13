import type { Rule } from 'eslint';

import type { RuleConfig } from '../config/types';

export type MetaData = {
	context: Rule.RuleContext;
	config: RuleConfig;
};
