// Original source from Compiled https://github.com/atlassian-labs/compiled/blob/master/packages/eslint-plugin/src/utils/create-no-tagged-template-expression-rule/index.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

import {
  CSS_IN_JS_IMPORTS,
  SupportedNameChecker,
} from '../../utils/is-supported-import';

import { generate } from './generate';
import { getTaggedTemplateExpressionOffset } from './get-tagged-template-expression-offset';
import { toArguments } from './to-arguments';

type RuleModule = Rule.RuleModule;
type RuleFixer = Rule.RuleFixer;

const IMPORT_SOURCES = [
  CSS_IN_JS_IMPORTS.compiled,
  CSS_IN_JS_IMPORTS.emotionReact,
  CSS_IN_JS_IMPORTS.emotionCore,
  CSS_IN_JS_IMPORTS.styledComponents,
];

export const createNoTaggedTemplateExpressionRule =
  (isUsage: SupportedNameChecker, messageId: string): RuleModule['create'] =>
  (context) => ({
    TaggedTemplateExpression(node) {
      const { references } = context.getScope();
      if (!isUsage(node.tag, references, IMPORT_SOURCES)) {
        return;
      }

      context.report({
        messageId,
        node,
        *fix(fixer: RuleFixer) {
          const { quasi } = node;
          const source = context.getSourceCode();

          // TODO Eventually handle comments instead of skipping them
          // Skip auto-fixing comments
          if (
            quasi.quasis
              .map((q) => q.value.raw)
              .join('')
              .match(/\/\*[\s\S]*\*\//g)
          ) {
            return;
          }

          // Replace empty tagged template expression with the equivalent object call expression
          if (
            !quasi.expressions.length &&
            quasi.quasis.length === 1 &&
            !quasi.quasis[0].value.raw.trim()
          ) {
            yield fixer.replaceText(quasi, '({})');
            return;
          }

          const args = toArguments(source, quasi);

          // Skip invalid CSS
          if (args.length < 1) {
            return;
          }

          const oldCode = source.getText(node);
          // Remove quasi:
          // styled.div<Props>`
          //    color: red;
          // `
          // becomes
          // styled.div<Props>
          const withoutQuasi = oldCode.replace(source.getText(quasi), '');
          const newCode =
            withoutQuasi +
            // Indent the arguments after the tagged template expression range
            generate(args, getTaggedTemplateExpressionOffset(node));

          if (oldCode === newCode) {
            return;
          }

          yield fixer.insertTextBefore(node, newCode);
          yield fixer.remove(node);
        },
      });
    },
  });
