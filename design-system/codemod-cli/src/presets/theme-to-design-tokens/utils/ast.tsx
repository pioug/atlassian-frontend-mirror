import core, { ASTNode, ASTPath } from 'jscodeshift';
import { isDecendantOfType } from '@codeshift/utils';

export function isDecendantOfToken(
  j: core.JSCodeshift,
  path: ASTNode,
): boolean {
  if (
    path.type === 'CallExpression' &&
    path.callee.type === 'Identifier' &&
    path.callee.name === 'token'
  ) {
    return true;
  }

  return (
    j(path).closest(j.CallExpression, { callee: { name: 'token' } }).length > 0
  );
}

export function isParentOfToken(j: core.JSCodeshift, path: any): boolean {
  if (
    path.type === 'CallExpression' &&
    path.callee.type === 'Identifier' &&
    path.callee.name === 'token'
  ) {
    return true;
  }

  return (
    j(path).find(j.CallExpression, { callee: { name: 'token' } }).length > 0
  );
}

export function getClosestDecendantOfType(
  j: core.JSCodeshift,
  path: ASTPath,
  type: any,
) {
  if (!isDecendantOfType(j, path, type)) {
    return;
  }

  return j(path).closest(type).get();
}
