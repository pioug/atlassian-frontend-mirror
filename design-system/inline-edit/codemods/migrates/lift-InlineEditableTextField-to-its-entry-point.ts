import core, {
  ASTPath,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportSpecifier,
} from 'jscodeshift';

const elevateComponentToNewEntryPoint =
  (pkg: string, toPkg: string, innerElementName: string) =>
  (j: core.JSCodeshift, root: any) => {
    const importDeclarations = root
      .find(j.ImportDeclaration)
      .filter(
        (path: ASTPath<ImportDeclaration>) => path.node.source.value === pkg,
      );

    const defaultSpecifier = importDeclarations
      .find(j.ImportDefaultSpecifier)
      .nodes();
    const otherSpecifier = importDeclarations.find(j.ImportSpecifier).nodes();

    const newDefaultSpecifier = defaultSpecifier.map(
      (s: ImportDefaultSpecifier) => {
        return j.importDeclaration(
          [j.importDefaultSpecifier(s.local)],
          j.literal(pkg),
        );
      },
    );

    const newOtherSpecifiers = otherSpecifier.map((s: ImportSpecifier) => {
      if (s.imported.name === innerElementName) {
        return j.importDeclaration(
          [j.importDefaultSpecifier(s.local)],
          j.literal(toPkg),
        );
      } else {
        return j.importDeclaration([s], j.literal(pkg));
      }
    });

    importDeclarations.forEach((path: ASTPath<ImportDeclaration>) => {
      j(path).replaceWith(newDefaultSpecifier);
      j(path).insertBefore(newOtherSpecifiers);
    });
  };

export default elevateComponentToNewEntryPoint(
  '@atlaskit/inline-edit',
  '@atlaskit/inline-edit/inline-editable-textfield',
  'InlineEditableTextfield',
);
