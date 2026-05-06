import type { JSCodeshift } from 'jscodeshift';

export function isParentOfToken(j: JSCodeshift, path: any): boolean {
	if (
		path.type === 'CallExpression' &&
		path.callee.type === 'Identifier' &&
		path.callee.name === 'token'
	) {
		return true;
	}

	return j(path).find(j.CallExpression, { callee: { name: 'token' } }).length > 0;
}
