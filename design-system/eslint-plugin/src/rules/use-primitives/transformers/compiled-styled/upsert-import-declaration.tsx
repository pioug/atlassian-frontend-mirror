import type { Rule } from 'eslint';

import * as ast from '../../../../ast-nodes';

/**
 * Currently this is defined here because it's not very general purpose.
 * If we were to move this to `ast-nodes`, half the implementation would be in `Root`,
 * and the other half would be in `Import`.
 *
 * TODO: Refactor and move to `ast-nodes`
 *
 * Note: It does not handle default imports, namespace imports, or aliased imports.
 */
export const upsertImportDeclaration = (
  {
    module,
    specifiers,
  }: {
    module: string;
    specifiers: string[];
  },
  context: Rule.RuleContext,
  fixer: Rule.RuleFixer,
): Rule.Fix | undefined => {
  // Find any imports that match the packageName
  const root = context.getSourceCode().ast.body;

  const importDeclarations = ast.Root.findImportsByModule(root, module);

  // The import doesn't exist yet, we can just insert a whole new one
  if (importDeclarations.length === 0) {
    return ast.Root.insertImport(root, { module, specifiers }, fixer);
  }

  // The import exists so, modify the existing one
  return ast.Import.insertNamedSpecifiers(
    importDeclarations[0],
    specifiers,
    fixer,
  );
};
