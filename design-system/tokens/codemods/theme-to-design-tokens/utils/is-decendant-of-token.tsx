import type { ASTNode, ASTPath, JSCodeshift } from 'jscodeshift';

export function isDecendantOfToken(j: JSCodeshift, path: ASTPath | ASTNode): boolean {
	if (
		'type' in path &&
		path.type === 'CallExpression' &&
		path.callee.type === 'Identifier' &&
		path.callee.name === 'token'
	) {
		return true;
	}

	return j(path).closest(j.CallExpression, { callee: { name: 'token' } }).length > 0;
}
