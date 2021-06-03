import { NodePath } from 'ast-types/lib/node-path';
import core, {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  Options,
} from 'jscodeshift';

type Nullable<T> = T | null;

function getDefaultSpinnerSpecifier(
  j: core.JSCodeshift,
  source: string,
): Nullable<string> {
  const specifiers = j(source)
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === '@atlaskit/spinner')
    .find(j.ImportDefaultSpecifier);

  if (!specifiers.length) {
    return null;
  }
  return specifiers.nodes()[0]!.local!.name;
}

function hasImportDeclaration(
  j: core.JSCodeshift,
  source: string,
  importPath: string,
): boolean {
  return (
    j(source)
      .find(j.ImportDeclaration)
      .filter(
        (path: ASTPath<ImportDeclaration>) =>
          path.node.source.value === importPath,
      ).length > 0
  );
}

// Changing `SpinnerSizes` type to `Size`
function changeTypeName(j: core.JSCodeshift, source: string): string {
  const base = j(source);

  // Replace 'SpinnerSizes' with 'Size' as import identifier
  base
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === '@atlaskit/spinner')
    .find(j.ImportSpecifier)
    .find(j.Identifier)
    .filter((identifier) => identifier.value.name === 'SpinnerSizes')
    .replaceWith(j.identifier('Size'));

  // Want to rename any uses of 'SpinnerSizes' type in the file
  // We only do this if the type is *not* aliased

  // Checking to see if the 'SpinnerSizes' import (now 'Size') type is aliased
  const isTypeImportAliased =
    base
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === '@atlaskit/spinner')
      .find(j.ImportSpecifier)
      .filter((specifier) => {
        if (specifier.value.imported.name !== 'Size') {
          return false;
        }
        const isAliased: boolean = Boolean(
          specifier.value.local && specifier.value.local.name !== 'Size',
        );

        return isAliased;
      }).length > 0;

  if (isTypeImportAliased) {
    return base.toSource();
  }

  return base
    .find(j.Identifier)
    .filter((identifier) => identifier.value.name === 'SpinnerSizes')
    .replaceWith(j.identifier('Size'))
    .toSource();
}

function getJSXAttributesByName({
  j,
  element,
  attributeName,
}: {
  j: core.JSCodeshift;
  element: NodePath;
  attributeName: string;
}) {
  return j(element)
    .find(j.JSXOpeningElement)
    .find(j.JSXAttribute)
    .filter((attribute) => {
      const matches = j(attribute)
        .find(j.JSXIdentifier)
        .filter((identifier) => identifier.value.name === attributeName);
      return Boolean(matches.length);
    });
}

function changeSpinnerUsage(j: core.JSCodeshift, source: string): string {
  const name: Nullable<string> = getDefaultSpinnerSpecifier(j, source);
  if (name == null) {
    return source;
  }

  return j(source)
    .findJSXElements(name)
    .forEach((element) => {
      // removing isCompleting prop
      getJSXAttributesByName({
        j,
        element,
        attributeName: 'isCompleting',
      }).remove();

      // removing onComplete prop
      getJSXAttributesByName({
        j,
        element,
        attributeName: 'onComplete',
      }).remove();

      // modify delay prop if needed
      getJSXAttributesByName({ j, element, attributeName: 'delay' })
        .filter((attribute) => {
          const toRemove = j(attribute)
            .find(j.JSXExpressionContainer)
            // Note: not using j.NumericLiteral as it doesn't play well with flow
            .find(j.Literal)
            .filter(
              (literal) =>
                typeof literal.value.value === 'number' &&
                literal.value.value <= 150,
            );

          return Boolean(toRemove.length);
        })
        .remove();

      // Changing `invertColor` prop to `appearance`
      getJSXAttributesByName({
        j,
        element,
        attributeName: 'invertColor',
      }).forEach((attribute) => {
        // change the name of the prop to appearance
        j(attribute)
          .find(j.JSXIdentifier)
          .replaceWith(j.jsxIdentifier('appearance'));

        // For usages where the `invertColor` had no value (ie a true value):
        // we need to set it to 'invert'`
        j(attribute)
          .filter((attr) => attr.node.value == null)
          .replaceWith(
            j.jsxAttribute(
              j.jsxIdentifier('appearance'),
              j.stringLiteral('invert'),
            ),
          );

        // if value is negative (invertColor={false}) then we can remove it
        j(attribute)
          .filter((attr) => {
            const isFalse = j(attr)
              .find(j.JSXExpressionContainer)
              .find(j.BooleanLiteral)
              .filter((literal) => !literal.node.value);

            return Boolean(isFalse.length);
          })
          .remove();

        // if `invertColor` value is positive we can change it to 'invert'
        j(attribute)
          .find(j.JSXExpressionContainer)
          .filter((expression) => {
            return (
              j(expression)
                .find(j.BooleanLiteral)
                .filter((literal) => literal.node.value).length > 0
            );
          })
          .replaceWith(j.stringLiteral('invert'));

        // if `invertColor` was an expression, then we replace it with a ternary
        j(attribute)
          .find(j.JSXExpressionContainer)
          .filter((container) => {
            return j(container).find(j.BooleanLiteral).length === 0;
          })
          .forEach((container) => {
            j(container).replaceWith(
              j.jsxExpressionContainer(
                j.conditionalExpression(
                  // Type 'JSXEmptyExpression' is not assignable to type 'ExpressionKind'.
                  // @ts-ignore TS2345
                  container.node.expression,
                  j.stringLiteral('invert'),
                  j.stringLiteral('inherit'),
                ),
              ),
            );
          });
      });
    })
    .toSource();
}

export default function transformer(
  file: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  // Exit early if not relevant
  // We are doing this so we don't touch the formatting of unrelated files
  if (!hasImportDeclaration(j, file.source, '@atlaskit/spinner')) {
    return file.source;
  }

  return changeTypeName(j, changeSpinnerUsage(j, file.source));
}

// Note: not exporting a 'parser' because doing so
// will prevent consumers overriding it
