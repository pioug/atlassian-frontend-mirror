import { isDecendantOfType } from '@hypermod/utils';
import type { ASTNode, ASTPath, JSCodeshift } from 'jscodeshift';

export function isDecendantOfToken(
  j: JSCodeshift,
  path: ASTPath | ASTNode,
): boolean {
  if (
    'type' in path &&
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

export function isParentOfToken(j: JSCodeshift, path: any): boolean {
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
  j: JSCodeshift,
  path: ASTPath<any>,
  type: any,
) {
  if (!isDecendantOfType(j, path, type)) {
    return;
  }

  return j(path).closest(type).get();
}
