import core, { ASTPath } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

// not replacing newlines (which \s does)
const spacesAndTabs: RegExp = /[ \t]{2,}/g;
const lineStartWithSpaces: RegExp = /^[ \t]*/gm;

function clean(value: string): string {
  return value
    .replace(spacesAndTabs, ' ')
    .replace(lineStartWithSpaces, '')
    .trim();
}

export function addCommentBefore(
  j: core.JSCodeshift,
  target: Collection<any>,
  message: string,
) {
  const content: string = ` TODO: (from codemod) ${clean(message)} `;
  target.forEach((path: ASTPath<any>) => {
    path.value.comments = path.value.comments || [];

    const exists = path.value.comments.find(
      (comment: any) => comment.value === content,
    );

    // avoiding duplicates of the same comment
    if (exists) {
      return;
    }

    path.value.comments.push(j.commentBlock(content));
  });
}
