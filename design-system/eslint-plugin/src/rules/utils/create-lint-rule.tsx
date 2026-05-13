import type { Rule } from 'eslint';

import { getCreateLintRule, type LintRule } from '@atlaskit/eslint-utils/create-rule';

import { getRuleUrl } from './get-rule-url';

/**
 * Tiny wrapped over the ESLint rule module type that ensures
 * there is a docs link to our ESLint plugin documentation page,
 * as well as improving type support.
 */
export const createLintRule: (rule: LintRule) => Rule.RuleModule = getCreateLintRule(getRuleUrl);
