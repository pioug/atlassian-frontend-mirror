/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
  isNodeOfType,
  JSXElement,
  JSXIdentifier,
  JSXOpeningElement,
} from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';

import {
  allowedAttrs,
  type MetaData,
  updateTestIdAttributeFix,
} from './common';

type ValidTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const tagSizeMap: Record<ValidTags, string> = {
  h1: 'xlarge',
  h2: 'large',
  h3: 'medium',
  h4: 'small',
  h5: 'xsmall',
  h6: 'xxsmall',
};

interface ValidHeadingElement extends JSXElement {
  parent: Rule.Node;
  openingElement: {
    name: JSXIdentifier & { name: ValidTags };
  } & JSXOpeningElement;
}

export const NativeElements = {
  lint(node: Rule.Node, { context, config }: MetaData) {
    // Check whether all criteria needed to make a transformation are met
    if (!NativeElements._check(node, { context, config })) {
      return;
    }

    context.report({
      node,
      messageId: 'preferHeading',
      suggest: [
        {
          desc: 'Convert to Heading',
          fix: NativeElements._fix(node, { context, config }),
        },
      ],
    });
  },

  _check(node: Rule.Node, { config }: MetaData): node is ValidHeadingElement {
    if (!config.patterns.includes('native-elements')) {
      return false;
    }

    if (!isNodeOfType(node, 'JSXElement')) {
      return false;
    }

    if (!node.parent) {
      return false;
    }

    const elementName = ast.JSXElement.getName(node);
    if (!Object.keys(tagSizeMap).includes(elementName)) {
      return false;
    }

    // Element has to be first element of its siblings
    if (
      !(
        isNodeOfType(node.parent, 'JSXElement') ||
        isNodeOfType(node.parent, 'JSXFragment')
      )
    ) {
      return false;
    }
    const siblings = ast.JSXElement.getChildren(node.parent);
    if (siblings.length > 1) {
      // Only report if element is first child element
      if (
        siblings[0].range?.[0] !== node.range?.[0] ||
        siblings[0].range?.[1] !== node.range?.[1]
      ) {
        return false;
      }
    }

    if (!ast.JSXElement.hasAllowedAttrsOnly(node, allowedAttrs)) {
      return false;
    }

    return true;
  },

  _fix(node: ValidHeadingElement, { context }: MetaData): Rule.ReportFixer {
    return (fixer) => {
      // change to default import
      const importFix = ast.Root.upsertDefaultImportDeclaration(
        {
          module: '@atlaskit/heading',
          localName: 'Heading',
        },
        context,
        fixer,
      );

      const elementName = ast.JSXElement.getName(node) as ValidTags;
      const elementNameFixes = ast.JSXElement.updateName(
        node,
        'Heading',
        fixer,
      );
      const size = tagSizeMap[elementName];
      const asAttributeFix = ast.JSXElement.addAttribute(
        node,
        'size',
        size,
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
