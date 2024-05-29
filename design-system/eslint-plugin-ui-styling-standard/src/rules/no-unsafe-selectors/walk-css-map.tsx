/**
 * This util is intentionally not in `@atlaskit/eslint-utils` at this time.
 *
 * This is because the API is likely to change and should not be considered stable.
 */

import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

type CssMapVisitorArgs =
  | {
      type: 'variant' | 'declaration' | 'ruleset' | 'selectors';
      node: ESTree.Property;
    }
  | { type: 'grouped-at-rules'; node: ESTree.Property; atRule: string };

type CssMapVisitor = (args: CssMapVisitorArgs) => void;

export function walkCssMap({
  context,
  importSources,
  visitor,
}: {
  context: Rule.RuleContext;
  program: ESTree.Program;
  importSources: string[];
  visitor: CssMapVisitor;
}) {
  const program = context.getSourceCode().ast;

  const importDeclaration = program.body.find(
    (node): node is ESTree.ImportDeclaration =>
      node.type === 'ImportDeclaration' &&
      importSources.includes(node.source.value as string),
  );

  const specifier = importDeclaration?.specifiers.find(
    (specifier) =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'cssMap',
  );

  if (!specifier) {
    return;
  }

  const [variable] = context
    .getSourceCode()
    .scopeManager.getDeclaredVariables(specifier);

  if (!variable) {
    return;
  }

  variable.references.forEach((reference) => {
    const identifier = reference.identifier as ESTree.Identifier &
      Rule.NodeParentExtension;

    const { parent } = identifier;
    if (parent.type !== 'CallExpression') {
      return;
    }

    const variantMap = parent.arguments[0];
    if (variantMap.type !== 'ObjectExpression') {
      return;
    }

    walkCssMapVariantMap({ variantMap, visitor });
  });
}

function walkCssMapVariantMap({
  variantMap,
  visitor,
}: {
  variantMap: ESTree.ObjectExpression;
  visitor: CssMapVisitor;
}) {
  variantMap.properties.forEach((property) => {
    if (property.type !== 'Property') {
      return;
    }

    walkCssMapVariant({ variant: property, visitor });
  });
}

function walkCssMapVariant({
  variant,
  visitor,
}: {
  variant: ESTree.Property;
  visitor: CssMapVisitor;
}) {
  visitor({
    type: 'variant',
    node: variant,
  });

  if (variant.value.type !== 'ObjectExpression') {
    return;
  }

  variant.value.properties.forEach((property) => {
    if (property.type !== 'Property') {
      return;
    }

    if (property.value.type !== 'ObjectExpression') {
      visitor({
        type: 'declaration',
        node: property,
      });
      return;
    }

    const keyValue = getKeyValue(property.key);

    if (keyValue && /^@[A-z-]+$/.test(keyValue)) {
      walkCssMapAtRuleGrouping({ atRuleGrouping: property, visitor });
      return;
    }

    if (keyValue === 'selectors') {
      walkCssMapSelectors({ selectors: property, visitor });
    }

    walkStyleRuleset({ ruleset: property, visitor });
  });
}

function walkCssMapAtRuleGrouping({
  atRuleGrouping,
  visitor,
}: {
  atRuleGrouping: ESTree.Property;
  visitor: CssMapVisitor;
}) {
  const atRule = getKeyValue(atRuleGrouping.key);
  if (!atRule) {
    return;
  }

  visitor({
    type: 'grouped-at-rules',
    node: atRuleGrouping,
    atRule,
  });

  if (atRuleGrouping.value.type !== 'ObjectExpression') {
    return;
  }

  atRuleGrouping.value.properties.forEach((property) => {
    if (property.type !== 'Property') {
      return;
    }

    walkStyleRuleset({ ruleset: property, visitor });
  });
}

function walkCssMapSelectors({
  selectors,
  visitor,
}: {
  selectors: ESTree.Property;
  visitor: CssMapVisitor;
}) {
  visitor({
    type: 'selectors',
    node: selectors,
  });

  if (selectors.value.type !== 'ObjectExpression') {
    return;
  }

  selectors.value.properties.forEach((property) => {
    if (property.type !== 'Property') {
      return;
    }

    walkStyleRuleset({ ruleset: property, visitor });
  });
}

function walkStyleRuleset({
  ruleset,
  visitor,
}: {
  ruleset: ESTree.Property;
  visitor: CssMapVisitor;
}) {
  visitor({
    type: 'ruleset',
    node: ruleset,
  });

  if (ruleset.value.type !== 'ObjectExpression') {
    return;
  }

  ruleset.value.properties.forEach((property) => {
    if (property.type !== 'Property') {
      return;
    }

    if (property.value.type === 'ObjectExpression') {
      walkStyleRuleset({ ruleset: property, visitor });
      return;
    }

    visitor({
      type: 'declaration',
      node: property,
    });
  });
}

function getKeyValue(key: ESTree.Property['key']): string | null {
  if (key.type === 'Identifier') {
    return key.name;
  }

  if (key.type === 'Literal') {
    return key.value?.toString() ?? null;
  }

  return null;
}
