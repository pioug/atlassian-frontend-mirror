import type {
  ASTPath,
  CallExpression,
  Collection,
  JSCodeshift,
} from 'jscodeshift';

import {
  getNamedSpecifier,
  hasImportDeclaration,
  removeImport,
} from '@atlaskit/codemod-utils';

type Operator = '+' | '-' | '*' | '/';
interface MathFunction {
  name: string;
  operator: Operator;
}

const themeMathFunctions: MathFunction[] = [
  { name: 'add', operator: '+' },
  { name: 'subtract', operator: '-' },
  { name: 'multiply', operator: '*' },
  { name: 'divide', operator: '/' },
];

export const mathToBinaryExpressions = (
  j: JSCodeshift,
  source: Collection<Node>,
) => {
  const hasImportFromMathEntryPoint = hasImportDeclaration(
    j,
    source,
    '@atlaskit/theme/math',
  );
  const namedImportFromTheme = getNamedSpecifier(
    j,
    source,
    '@atlaskit/theme',
    'math',
  );

  if (!hasImportFromMathEntryPoint && !namedImportFromTheme) {
    return;
  }

  const cleanUpImports = () => {
    if (hasImportFromMathEntryPoint) {
      removeImport(j, source, '@atlaskit/theme/math');
      return;
    }

    const themeImportSpecifiers = source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === '@atlaskit/theme')
      .find(j.ImportSpecifier);

    // If math is the only specifier, we remove the whole import statement.
    // Otherwise we'll just remove the math specifier.
    if (themeImportSpecifiers.length === 1 && namedImportFromTheme) {
      removeImport(j, source, '@atlaskit/theme');
    } else {
      themeImportSpecifiers
        .filter((path) => path.node.imported.name === 'math')
        .remove();
    }
  };

  const grabArgsAndCreateReplacement = (
    path: ASTPath<CallExpression>,
    operator: Operator,
  ) => {
    // @ts-ignore
    const leftArg = j.callExpression(path.value.arguments[0], []);
    const rightArg = path.value.arguments[1];
    // @ts-ignore
    j(path).replaceWith(j.binaryExpression(operator, leftArg, rightArg));
  };

  const replaceMathFunctionsWithBinaryExpressions = () => {
    themeMathFunctions.forEach((mathFunction) => {
      // Transform cases that are direct calls of math fns, eg: add(gridSize, 4)
      source
        .find(j.CallExpression, {
          callee: {
            type: 'Identifier',
            name: mathFunction.name,
          },
        })
        .forEach((path: ASTPath<CallExpression>) => {
          grabArgsAndCreateReplacement(path, mathFunction.operator);
        });

      // Transform calls from fns on the math object, eg: math.add(gridSize, 4)
      source
        .find(j.CallExpression, {
          callee: {
            type: 'MemberExpression',
            object: {
              name: 'math',
            },
            property: {
              name: mathFunction.name,
            },
          },
        })
        .forEach((path: ASTPath<CallExpression>) => {
          grabArgsAndCreateReplacement(path, mathFunction.operator);
        });
    });
  };

  cleanUpImports();
  replaceMathFunctionsWithBinaryExpressions();
};
