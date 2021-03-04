import core, {
  ASTPath,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportSpecifier,
} from 'jscodeshift';

import { addCommentToStartOfFile } from './utils';

const commentMessage = `We could not automatically convert this code to the new API.

This file uses \`InlineEdit\` and \`InlineEditStateless\` at the same time. We've merged these two types since version 12.0.0, and please use the merged version instead.
`;

const elevateComponentToDefault = (
  pkg: string,
  toPkg: string,
  innerElementName: string,
) => (j: core.JSCodeshift, root: any) => {
  const importDeclarations = root
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) => path.node.source.value === pkg,
    );

  const defaultSpecifier = importDeclarations
    .find(j.ImportDefaultSpecifier)
    .nodes();
  const otherSpecifier = importDeclarations.find(j.ImportSpecifier).nodes();

  const isImportingStateless =
    otherSpecifier.filter(
      (s: ImportSpecifier) =>
        s.imported && s.imported.name === innerElementName,
    ).length > 0;

  if (defaultSpecifier.length > 0 && isImportingStateless) {
    addCommentToStartOfFile({ j, base: root, message: commentMessage });
    return;
  }

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

export default elevateComponentToDefault(
  '@atlaskit/inline-edit',
  '@atlaskit/inline-edit',
  'InlineEditStateless',
);
