// Original source from Compiled https://github.com/atlassian-labs/compiled/blob/master/packages/eslint-plugin/src/utils/create-no-tagged-template-expression-rule/index.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import type { JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';
import type { Rule } from 'eslint';

import {
  getImportSources,
  isEmotion,
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

            // For styles like `position: initial !important`,
            // Emotion can give typechecking errors when using object syntax
            // due to csstype being overly strict
            const usesEmotion = isEmotion(node.tag, references, importSources);
            if (usesEmotion && !!newCode.match(/!\s*important/gm)) {
              return;
            }

            // For styled-components, we might also want to similarly disallow or autofix `styled.div({ color: props => props.color })` as it's broken too (both type and functionality). This is tracked in https://product-fabric.atlassian.net/browse/USS-26.
            if (/\$\{.*:[\s]*\{/.test(newCode)) {
              /**
               * If we find a variable in a selector, we skip it. There are two reasons:
               *
               * - `styled-components@3.x` does not support variables in a selector (see the first example).
               *
               * - We cannot guarantee that the contents of an function call is actually a selector, and not a CSS block (see the third example).
               *
               * @examples
               * ```tsx
               * const Component = styled.div`
               *   & + ${Button} { color: red; }
               * `;
               * ```
               *
               * ```tsx
               * const Component = styled.div`
               *   ${mixin()} button { color: red; }
               * `;
               * ```
               *
               * ```tsx
               * const styles = `&:active { color: blue; }`;
               * const Component = styled.div`
               *   ${styles} &:hover {
               *     color: red;
               *   }
               * `;
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
