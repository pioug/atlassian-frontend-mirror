/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, JSXElement } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';
import { upsertImportDeclaration } from '../../use-primitives/transformers/emotion-css/upsert-import-declaration';
import { RuleConfig } from '../config';

import { allowedAttrs, updateTestIdAttributeFix } from './common';

interface MetaData {
  context: Rule.RuleContext;
  config: RuleConfig;
}

type FixFunction = (fixer: Rule.RuleFixer) => Rule.Fix[];

export const EmphasisElements = {
  lint(node: Rule.Node, { context, config }: MetaData) {
    if (!isNodeOfType(node, 'JSXElement')) {
      return;
    }

    // Check whether all criteria needed to make a transformation are met
    if (!EmphasisElements._check(node, { context, config })) {
      return;
    }

    context.report({
      node: node.openingElement,
      messageId: 'preferPrimitivesText',
      suggest: [
        {
          desc: `Convert to Text`,
          fix: EmphasisElements._fix(node, { context }),
        },
      ],
    });
  },

  _check(node: JSXElement, { context, config }: MetaData): boolean {
    if (!config.patterns.includes('emphasis-elements')) {
      return false;
    }

    const elementName = ast.JSXElement.getName(node);
    if (elementName !== 'em') {
      return false;
    }

    // Element has no unallowed props
    if (!ast.JSXElement.hasAllowedAttrsOnly(node, allowedAttrs)) {
      return false;
    }

    // If there is more than one `@atlaskit/primitives` import, then it becomes difficult to determine which import to transform
    const importDeclaration = ast.Root.findImportsByModule(
      context.getSourceCode().ast.body,
      '@atlaskit/primitives',
    );
    if (importDeclaration.length > 1) {
      return false;
    }

    return true;
  },

  _fix(
    node: JSXElement,
    { context }: { context: Rule.RuleContext },
  ): FixFunction {
    return (fixer: Rule.RuleFixer) => {
      const importFix = upsertImportDeclaration(
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
        'em',
        fixer,
      );

      const testAttributeFix = updateTestIdAttributeFix(node, fixer);

      return [
        importFix,
        ...elementNameFixes,
        asAttributeFix,
        testAttributeFix,
      ].filter((fix): fix is Rule.Fix => Boolean(fix)); // Some of the transformers can return arrays with undefined, so filter them out
    };
  },
};
