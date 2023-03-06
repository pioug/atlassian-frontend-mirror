import { ESLintUtils } from '@typescript-eslint/utils';

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://atlassian.design/components/eslint-plugin-design-system/examples#${name}`,
);
