import {
  getCreateLintRule,
  getPathSafeName,
} from '@atlaskit/eslint-utils/create-rule';

/**
 * Tiny wrapped over the ESLint rule module type that ensures
 * there is a docs link to our ESLint plugin documentation page,
 * as well as improving type support.
 */
export const createLintRule = getCreateLintRule(getRuleUrl);

export function getRuleUrl(ruleName: string) {
  const name = getPathSafeName(ruleName);
  return `https://atlassian.design/components/eslint-plugin-ui-styling-standard/${name}/usage`;
}
