// Original source from Compiled https://github.com/atlassian-labs/compiled/blob/master/packages/eslint-plugin/src/utils/create-no-tagged-template-expression-rule/index.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import type { JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';
import type { Rule } from 'eslint';

import {
  getImportSources,
  isStyledComponents,
  SupportedNameChecker,
} from '../is-supported-import';

import { generate } from './generate';
import { getTaggedTemplateExpressionOffset } from './get-tagged-template-expression-offset';
import { toArguments } from './to-arguments';

type RuleModule = Rule.RuleModule;
type RuleFixer = Rule.RuleFixer;

export const noTaggedTemplateExpressionRuleSchema: JSONSchema4 = [
  {
    type: 'object',
    properties: {
      importSources: {
        type: 'array',
        items: { type: 'string' },
        uniqueItems: true,
      },
    },
  },
];

/**
 * When true, template strings containing multiline comments are completely skipped over.
 *
 * When false, multiline comments are stripped out. Ideally we would preserve them,
 * but it would add a lot of complexity.
 */
const shouldSkipMultilineComments = false;

export const createNoTaggedTemplateExpressionRule =
  (isUsage: SupportedNameChecker, messageId: string): RuleModule['create'] =>
  (context) => {
    const importSources = getImportSources(context);

    return {
      TaggedTemplateExpression(node) {
        const { references } = context.getScope();

        if (!isUsage(node.tag, references, importSources)) {
          return;
        }

        const isSC = isStyledComponents(node.tag, references, importSources);

        context.report({
          messageId,
          node,
          *fix(fixer: RuleFixer) {
            const { quasi } = node;
            const source = context.getSourceCode();

            // TODO Eventually handle comments instead of skipping them
            // Skip auto-fixing comments
            if (
              shouldSkipMultilineComments &&
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

            // TODO: We might want to similarly disallow `styled.div({ color: props => props.color })` for SC as it's broken too (both type and functionality)
            // Alternatively, autofix it to `styled.div(props => ({ color: props.color }))`?
            if (isSC && /\$\{.*:[\s]*\{/.test(newCode)) {
              /**
               * If we find a variable in a selector when migrating `styled-components` code, we skip it.
               * This is because `styled-components@3.x` does not support the syntax.
               *
               * @example
               * ```tsx
               * const Component = styled.div`
               *   & + ${Button} { color: red; }
               * `;
               * ```
               * Becomes this code, which is not supported in `styled-components@3.x`:
               * ```tsx
               * const Component = styled.div({
               *   [`& + ${Button}`]: {
               *     color: 'red',
               * });
               * ```
               */
              return;
            }

            yield fixer.insertTextBefore(node, newCode);
            yield fixer.remove(node);
          },
        });
      },
    };
  };
