import core, { CallExpression } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export function doesIdentifierExist({
  j,
  base,
  name,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  name: string;
}): boolean {
  return (
    base.find(j.Identifier).filter((identifer) => identifer.value.name === name)
      .length > 0
  );
}

export function hasDynamicImport(
  j: core.JSCodeshift,
  source: Collection<any>,
  importPath: string,
) {
  return !!getDynamicImportName(j, source, importPath);
}

export function getDynamicImportName(
  j: core.JSCodeshift,
  source: Collection<any>,
  importPath: string,
) {
  const dynamicImports = source
    .find(j.VariableDeclarator)
    .filter((variableDeclaratorPath) => {
      return (
        j(variableDeclaratorPath)
          .find(j.CallExpression)
          .filter((callExpressionPath) => {
            const {
              callee,
              arguments: callExpressionArguments,
            } = callExpressionPath.node;

            return !!(
              isCallExpressionCalleeImportType(callee) &&
              isCallExpressionArgumentStringLiteralType(
                callExpressionArguments,
              ) &&
              isCallExpressionArgumentValueMatches(
                callExpressionArguments[0],
                j,
                importPath,
              )
            );
          }).length > 0
      );
    });

  if (!dynamicImports.length) {
    return null;
  }

  const { id } = dynamicImports.nodes()[0];

  if (id.type !== 'Identifier') {
    return null;
  }

  return id.name;
}
function isCallExpressionCalleeImportType(callee: CallExpression['callee']) {
  return callee && callee.type === 'Import';
}
function isCallExpressionArgumentStringLiteralType(
  callExpressionArguments: CallExpression['arguments'],
) {
  return (
    callExpressionArguments &&
    callExpressionArguments.length &&
    callExpressionArguments[0].type === 'StringLiteral'
  );
}
function isCallExpressionArgumentValueMatches(
  callExpressionArgument: CallExpression['arguments'][0],
  j: core.JSCodeshift,
  value: string,
) {
  return j(callExpressionArgument).some((path) => path.node.value === value);
}
