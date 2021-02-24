import core, { ASTPath, ImportDeclaration } from 'jscodeshift';

const elevateComponentToNewEntryPoint = (
  pkg: string,
  toPkg: string,
  innerElementName: string,
) => (j: core.JSCodeshift, root: any) => {
  root
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) => path.node.source.value === pkg,
    )
    .forEach((path: ASTPath<ImportDeclaration>) => {
      const defaultSpecifier = path.value.specifiers.filter(
        specifier => specifier.type === 'ImportDefaultSpecifier',
      );

      const otherSpecifier = path.value.specifiers.filter(
        specifier => specifier.type === 'ImportSpecifier',
      );

      const declaration = otherSpecifier.map(s => {
        return j.importDeclaration(
          [j.importDefaultSpecifier(s.local)],
          j.literal(toPkg),
        );
      });

      j(path).replaceWith(
        defaultSpecifier.map(s => {
          return j.importDeclaration(
            [j.importDefaultSpecifier(s.local)],
            j.literal(pkg),
          );
        }),
      );

      j(path).insertBefore(declaration);
    });
};

export default elevateComponentToNewEntryPoint(
  '@atlaskit/inline-edit',
  '@atlaskit/inline-edit/inline-editable-textfield',
  'InlineEditableTextfield',
);
