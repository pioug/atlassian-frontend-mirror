import { isNodeOfType, type Node } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';
import { getModuleOfIdentifier } from '../utils/get-import-node-by-source';
import { getJSXElementName } from '../utils/jsx';

const unsafeOverrides = ['css', 'className', 'theme', 'cssFn', 'styles'];

const rule = createLintRule({
  meta: {
    docs: {
      recommended: true,
      // This should be an error but for now we're rolling it out as warn so we can actually get it into codebases.
      severity: 'warn',
      description:
        'Discourage usage of unsafe style overrides used against the Atlassian Design System.',
    },
    name: 'no-unsafe-style-overrides',
    messages: {
      noUnsafeStyledOverride:
        'Wrapping {{componentName}} in a styled component encourages unsafe style overrides which cause friction and incidents when its internals change.',
      noUnsafeOverrides:
        'The {{propName}} prop encourages unsafe style overrides which cause friction and incidents when {{componentName}} internals change.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type !== 'Identifier' ||
          !node.callee.name.toLowerCase().includes('styled')
        ) {
          // Ignore functions that don't look like styled().
          return;
        }

        const firstArgument = node.arguments[0];
        if (!firstArgument || firstArgument.type !== 'Identifier') {
          return;
        }

        const moduleName = getModuleOfIdentifier(
          context.getSourceCode(),
          firstArgument.name,
        );

        if (!moduleName || !moduleName.moduleName.startsWith('@atlaskit')) {
          // Ignore styled calls with non-atlaskit components.
          return;
        }

        context.report({
          node: firstArgument,
          messageId: 'noUnsafeStyledOverride',
          data: { componentName: moduleName.importName },
        });
      },
      JSXAttribute(node: Node) {
        if (
          !isNodeOfType(node, 'JSXAttribute') ||
          !(node.parent && isNodeOfType(node.parent, 'JSXOpeningElement'))
        ) {
          return;
        }

        const elementName = getJSXElementName(node.parent);
        const moduleName = getModuleOfIdentifier(
          context.getSourceCode(),
          elementName,
        );

        if (!moduleName || !moduleName.moduleName.startsWith('@atlaskit')) {
          return;
        }

        const propName =
          typeof node.name.name === 'string'
            ? node.name.name
            : node.name.name.name;

        if (unsafeOverrides.includes(propName)) {
          context.report({
            node,
            messageId: 'noUnsafeOverrides',
            data: { propName, componentName: moduleName.importName },
          });
        }
      },
    };
  },
});

export default rule;
