import type { Rule, Scope } from 'eslint';

import {
  getImportSources,
  isCompiled,
} from '@atlaskit/eslint-utils/is-supported-import';
import { createLintRule } from '../utils/create-rule';

const isIdentifierReferenced = (
  hasImportSpecifier: (def: Scope.Definition) => boolean,
  node: Rule.Node,
  references: Scope.Reference[],
): boolean =>
  references.some(
    (reference) =>
      reference.identifier === node &&
      reference.resolved?.defs.some(hasImportSpecifier),
  );

const isTypographyImportSpecifier = (def: Scope.Definition): boolean =>
  def.node.type === 'ImportSpecifier' &&
  def.node.imported.type === 'Identifier' &&
  def.parent?.type === 'ImportDeclaration' &&
  ((def.node.imported.name === 'typography' &&
    def.parent?.source.value === '@atlaskit/theme') ||
    def.parent?.source.value === '@atlaskit/theme/typography');

const isElevationImportSpecifier = (def: Scope.Definition): boolean =>
  def.node.type === 'ImportSpecifier' &&
  def.node.imported.type === 'Identifier' &&
  def.parent?.type === 'ImportDeclaration' &&
  ((def.node.imported.name === 'elevation' &&
    def.parent?.source.value === '@atlaskit/theme') ||
    def.parent?.source.value === '@atlaskit/theme/elevation');

const isSkeletonShimmerImportSpecifier = (def: Scope.Definition): boolean =>
  def.node.type === 'ImportSpecifier' &&
  def.node.imported.type === 'Identifier' &&
  def.parent?.type === 'ImportDeclaration' &&
  def.node.imported.name === 'skeletonShimmer' &&
  typeof def.parent?.source.value === 'string' &&
  def.parent?.source.value?.startsWith('@atlaskit/theme');

const checkIdentifier = (
  node: Rule.Node,
  context: Rule.RuleContext,
  references: Scope.Reference[],
) => {
  if (isIdentifierReferenced(isTypographyImportSpecifier, node, references)) {
    context.report({
      messageId: 'usingTypography',
      node,
    });
  }

  if (isIdentifierReferenced(isElevationImportSpecifier, node, references)) {
    context.report({
      messageId: 'usingElevation',
      node,
    });
  }

  if (
    isIdentifierReferenced(isSkeletonShimmerImportSpecifier, node, references)
  ) {
    context.report({
      messageId: 'usingSkeletonShimmer',
      node,
    });
  }
};

export const rule = createLintRule({
  meta: {
    name: 'atlaskit-theme',
    docs: {
      description:
        'Ban certain usages of `@atlaskit/theme` that `@compiled/react` does not understand',
      recommended: true,
      severity: 'error',
    },
    messages: {
      usingTypography:
        'Typography does not work with Compiled. Please utilise alternatives like Heading or tokens instead and see https://atlassian.design/components/eslint-plugin-ui-styling-standard/atlaskit-theme/usage',
      usingElevation:
        'Elevation does not work with Compiled. Please use a token with a fallback instead and see https://atlassian.design/components/eslint-plugin-ui-styling-standard/atlaskit-theme/usage',
      usingSkeletonShimmer:
        'Skeleton Shimmer does not work with Compiled. Please use an SVG skeleton instead and see https://atlassian.design/components/eslint-plugin-ui-styling-standard/atlaskit-theme/usage',
    },
    schema: [],
    type: 'problem',
  },
  create(context) {
    const importSources = getImportSources(context);

    return {
      'CallExpression Identifier': (node: Rule.Node): void => {
        const { references } = context.getScope();
        const ancestors = context.getAncestors();

        // Check if ancestor node is a call expression to Compiled
        if (
          ancestors.some(
            (ancestor) =>
              ancestor.type === 'CallExpression' &&
              ancestor.callee &&
              isCompiled(ancestor.callee, references, importSources),
          )
        ) {
          // Check identifier for violations
          checkIdentifier(node, context, references);
        }
      },

      'TaggedTemplateExpression Identifier': (node: Rule.Node): void => {
        const { references } = context.getScope();
        const ancestors = context.getAncestors();

        // Check if ancestor node is a tagged template expression to Compiled
        if (
          ancestors.some(
            (ancestor) =>
              ancestor.type === 'TaggedTemplateExpression' &&
              ancestor.tag &&
              isCompiled(ancestor.tag, references, importSources),
          )
        ) {
          // Check identifier for violations
          checkIdentifier(node, context, references);
        }
      },
    };
  },
});

export default rule;
