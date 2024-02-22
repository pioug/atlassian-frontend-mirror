// eslint-disable-next-line import/no-extraneous-dependencies
import type { Scope } from 'eslint';
import type { CallExpression, Identifier } from 'estree';

import { CSS_IN_JS_IMPORTS, ImportSource } from '../utils/is-supported-import';

type Definition = Scope.Definition;
type Callee = CallExpression['callee'];
type Reference = Scope.Reference;

const functionName = 'styled';

const checkDefinitionHasImport = (
  def: Definition,
  importSources: ImportSource[],
) => {
  if (def.type !== 'ImportBinding') {
    return false;
  }

  if (
    !def.parent ||
    !importSources.includes(def.parent.source.value as ImportSource)
  ) {
    return false;
  }

  // `@compiled/react` only exposes styled as a named export
  if (
    importSources.includes(CSS_IN_JS_IMPORTS.compiled) &&
    def.parent.source.value === CSS_IN_JS_IMPORTS.compiled
  ) {
    return (
      def.node.type === 'ImportSpecifier' &&
      def.node.imported.name === functionName
    );
  }

  // `@emotion/styled` only exposes styled as a default export
  if (
    importSources.includes(CSS_IN_JS_IMPORTS.emotionStyled) &&
    def.parent.source.value === CSS_IN_JS_IMPORTS.emotionStyled
  ) {
    return def.node.type === 'ImportDefaultSpecifier';
  }

  // `styled-components` only exposes styled as a default export
  if (
    importSources.includes(CSS_IN_JS_IMPORTS.styledComponents) &&
    def.parent.source.value === CSS_IN_JS_IMPORTS.styledComponents
  ) {
    return def.node.type === 'ImportDefaultSpecifier';
  }

  return false;
};

export const isStyled = (
  nodeToCheck: Callee,
  referencesInScope: Reference[],
  importSources: ImportSource[],
): boolean => {
  let nodeIdentifier: Identifier | null = null;

  // Handles styled.div`` case
  if (
    nodeToCheck.type === 'MemberExpression' &&
    nodeToCheck.object.type === 'Identifier'
  ) {
    nodeIdentifier = nodeToCheck.object;
  }

  // Handles styled(Base)`` case
  if (
    nodeToCheck.type === 'CallExpression' &&
    nodeToCheck.callee.type === 'Identifier'
  ) {
    nodeIdentifier = nodeToCheck.callee;
  }

  return referencesInScope.some((reference) => {
    return (
      reference.identifier === nodeIdentifier &&
      reference.resolved?.defs.some((def) =>
        checkDefinitionHasImport(def, importSources),
      )
    );
  });
};
