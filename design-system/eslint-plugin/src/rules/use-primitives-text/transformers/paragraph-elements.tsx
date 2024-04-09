/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, JSXElement } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';

import {
  addColorInheritAttributeFix,
  allowedAttrs,
  type MetaData,
  updateTestIdAttributeFix,
} from './common';

type CheckResult = {
  success: boolean;
  refs: { siblings: JSXElement['children'] };
};

export const ParagraphElements = {
  lint(node: Rule.Node, { context, config }: MetaData) {
    if (!isNodeOfType(node, 'JSXElement')) {
      return;
    }

    // Check whether all criteria needed to make a transformation are met
    const { success, refs } = ParagraphElements._check(node, {
      context,
      config,
    });
    if (!success) {
      return;
    }

    if (refs.siblings.length > 1) {
      /**
       * Highlighting from first opening element to last closing element
       * to indicate fix will change all p elements and wrap them in a Stack,
       * falls back to first opening element.
       */
      const startLoc = refs.siblings[0].loc?.start;
      const endLoc = refs.siblings[refs.siblings.length - 1].loc?.end;
      context.report({
        loc: startLoc && endLoc && { start: startLoc, end: endLoc },
        node: node.openingElement,
        messageId: 'preferPrimitivesStackedText',
        suggest: [
          {
            desc: 'Convert to Text and Stack',
            fix: ParagraphElements._fixMultiple(node, {
              context,
              config,
              refs,
            }),
          },
        ],
      });
    } else {
      context.report({
        node,
        messageId: 'preferPrimitivesText',
        suggest: [
          {
            desc: 'Convert to Text',
            fix: ParagraphElements._fixSingle(node, { context, config }),
          },
        ],
      });
    }
  },

  _check(
    node: JSXElement & { parent: Rule.Node },
    { context, config }: MetaData,
  ): CheckResult {
    if (!config.patterns.includes('paragraph-elements')) {
      return { success: false, refs: { siblings: [] } };
    }

    const elementName = ast.JSXElement.getName(node);
    if (elementName !== 'p') {
      return { success: false, refs: { siblings: [] } };
    }

    // All siblings have to be paragraph elements with no unallowed props
    if (!isNodeOfType(node.parent, 'JSXElement')) {
      return { success: false, refs: { siblings: [] } };
    }
    const siblings = ast.JSXElement.getChildren(node.parent);
    if (siblings.length > 1) {
      // Only report for the first p element by comparing node location
      if (
        siblings[0].range?.[0] !== node.range?.[0] ||
        siblings[0].range?.[1] !== node.range?.[1]
      ) {
        return { success: false, refs: { siblings } };
      }
      // Only report when every sibling is a p element
      const siblingsMatch = siblings.every((child) => {
        if (!isNodeOfType(child, 'JSXElement')) {
          return false;
        }

        if (ast.JSXElement.getName(child) !== 'p') {
          return false;
        }

        return ast.JSXElement.hasAllowedAttrsOnly(child, allowedAttrs);
      });
      if (!siblingsMatch) {
        return { success: false, refs: { siblings } };
      }
    } else if (!ast.JSXElement.hasAllowedAttrsOnly(node, allowedAttrs)) {
      return { success: false, refs: { siblings } };
    }

    const importDeclaration = ast.Root.findImportsByModule(
      context.getSourceCode().ast.body,
      '@atlaskit/primitives',
    );

    // If there is more than one `@atlaskit/primitives` import, then it becomes difficult to determine which import to transform
    if (importDeclaration.length > 1) {
      return { success: false, refs: { siblings } };
    }

    return { success: true, refs: { siblings } };
  },

  _fixSingle(
    node: JSXElement & { parent: Rule.Node },
    { context, config }: MetaData,
  ): Rule.ReportFixer {
    return (fixer) => {
      const importFix = ast.Root.upsertNamedImportDeclaration(
        {
          module: '@atlaskit/primitives',
          specifiers: ['Text'],
        },
        context,
        fixer,
      );

      const elementNameFixes = ast.JSXElement.updateName(node, 'Text', fixer);
      const asAttributeFix = ast.JSXElement.addAttribute(
        node,
        'as',
        'p',
        fixer,
      );
      const colorAttributeFix = addColorInheritAttributeFix(
        node,
        config,
        fixer,
      );
      const testAttributeFix = updateTestIdAttributeFix(node, fixer);

      return [
        importFix,
        ...elementNameFixes,
        asAttributeFix,
        colorAttributeFix,
        testAttributeFix,
      ].filter((fix): fix is Rule.Fix => Boolean(fix)); // Some of the transformers can return arrays with undefined, so filter them out
    };
  },

  _fixMultiple(
    node: JSXElement & { parent: Rule.Node },
    { context, config, refs }: MetaData & { refs: CheckResult['refs'] },
  ): Rule.ReportFixer {
    return (fixer) => {
      if (
        !isNodeOfType(node.parent, 'JSXElement') ||
        !node.parent.closingElement
      ) {
        return [];
      }

      const importFix = ast.Root.upsertNamedImportDeclaration(
        {
          module: '@atlaskit/primitives',
          specifiers: ['Text', 'Stack'],
        },
        context,
        fixer,
      );

      // Update all siblings elements and their attributes
      const siblingFixes = refs.siblings
        .map((sibling) => {
          if (isNodeOfType(sibling, 'JSXElement')) {
            const elementNameFixes = ast.JSXElement.updateName(
              sibling,
              'Text',
              fixer,
            );
            const asAttributeFix = ast.JSXElement.addAttribute(
              sibling,
              'as',
              'p',
              fixer,
            );
            const colorAttributeFix = addColorInheritAttributeFix(
              sibling,
              config,
              fixer,
            );
            const testAttributeFix = updateTestIdAttributeFix(sibling, fixer);

            return [
              ...elementNameFixes,
              asAttributeFix,
              colorAttributeFix,
              testAttributeFix,
            ];
          }
          return undefined;
        })
        .flat();

      // Wrap in <Stack /> when more than 1 sibling
      const wrapperOpenElementFix = fixer.insertTextAfter(
        node.parent.openingElement,
        `<Stack space='space.150'>`,
      );
      const wrapperCloseElementFix = fixer.insertTextBefore(
        node.parent.closingElement,
        '</Stack>',
      );

      return [
        importFix,
        ...siblingFixes,
        wrapperOpenElementFix,
        wrapperCloseElementFix,
      ].filter((fix): fix is Rule.Fix => Boolean(fix)); // Some of the transformers can return arrays with undefined, so filter them out
    };
  },
};
