import type { Linter, Rule } from 'eslint';

import { recommended } from './config/recommended';
import { noLookaheadLookbehindRegexp } from './rules/noLookaheadLookbehindRegex';

export const configs: {
	recommended: Linter.BaseConfig<Linter.RulesRecord, Linter.RulesRecord>;
} = {
	recommended,
};

export const rules: {
	'no-lookahead-lookbehind-regexp': Rule.RuleModule;
} = {
	'no-lookahead-lookbehind-regexp': noLookaheadLookbehindRegexp,
};
