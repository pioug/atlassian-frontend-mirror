import type { Rule } from 'eslint';

import {
  getImportSources,
  type SupportedNameChecker,
} from '../is-supported-import';

import { checkIfSupportedExport } from './check-if-supported-export';

type RuleModule = Rule.RuleModule;

/**
 * Creates a new ESLint rule for banning exporting certain function calls, e.g.
 * `css` and `keyframes`.
 *
 * Copied from the `utils/create-no-exported-rule/` folder in @compiled/eslint-plugin.
 *
 * Requires an importSources option defined on the rule, which is used to define additional
 * packages which should be checked as part of this rule.
 *
 * @param isUsage A function that checks whether the current node matches the desired
 *                function call to check.
 * @param messageId The ESLint error message to use for lint violations.
 * @returns An eslint rule.
 */
export const createNoExportedRule =
  (isUsage: SupportedNameChecker, messageId: string): RuleModule['create'] =>
  (context) => {
    const importSources = getImportSources(context);

    const { text } = context.getSourceCode();
    if (importSources.every((importSource) => !text.includes(importSource))) {
      return {};
    }

    return {
      CallExpression(node) {
        const { references } = context.getScope();
        if (!isUsage(node.callee, references, importSources)) {
          return;
        }

        const state = checkIfSupportedExport(context, node, importSources);
        if (!state.isExport) {
          return;
        }

        context.report({
          messageId,
          node: state.node,
        });
      },
      TaggedTemplateExpression(node) {
        const { references } = context.getScope();
        if (!isUsage(node.tag, references, importSources)) {
          return;
        }

        const state = checkIfSupportedExport(context, node, importSources);
        if (!state.isExport) {
          return;
        }

        context.report({
          messageId,
          node: state.node,
        });
      },
    };
  };
