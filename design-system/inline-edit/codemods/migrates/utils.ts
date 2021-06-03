import core, { ASTPath, ImportDeclaration, Program } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

function addCommentBefore({
  j,
  target,
  message,
}: {
  j: core.JSCodeshift;
  target:
    | Collection<Node>
    | Collection<Program>
    | Collection<ImportDeclaration>;
  message: string;
}) {
  const content: string = ` TODO: (from codemod) ${message} `;
  target.forEach((path: ASTPath<any>) => {
    path.value.comments = path.value.comments || [];

    const exists = path.value.comments.find(
      (comment: ASTPath<any>) => comment.value === content,
    );

    // avoiding duplicates of the same comment
    if (exists) {
      return;
    }

    path.value.comments.push(j.commentBlock(content));
  });
}

function addCommentToStartOfFile({
  j,
  base,
  message,
}: {
  j: core.JSCodeshift;
  base: Collection<Node>;
  message: string;
}) {
  addCommentBefore({
    j,
    target: base.find(j.Program),
    message,
  });
}

function getJSXAttributesByName(
  j: core.JSCodeshift,
  element: ASTPath<any>,
  attributeName: string,
) {
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

const getDefaultSpecifierName = (
  j: core.JSCodeshift,
  base: Collection<any>,
  packageName: string,
) => {
  const specifiers = base
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === packageName,
    )
    .find(j.ImportDefaultSpecifier);

  if (!specifiers.length) {
    return null;
  }

  return specifiers.nodes()[0]!.local!.name;
};

const hasJSXAttributesByName = (
  j: core.JSCodeshift,
  element: ASTPath<any>,
  attributeName: string,
) => getJSXAttributesByName(j, element, attributeName).length > 0;

export {
  getDefaultSpecifierName,
  getJSXAttributesByName,
  hasJSXAttributesByName,
  addCommentToStartOfFile,
};
