import { type Rule } from 'eslint';
import type { Literal, RegExpLiteral } from 'estree';

export function isRegExpLiteral(
	literal: Literal & Rule.NodeParentExtension,
): literal is RegExpLiteral & Rule.NodeParentExtension {
	return 'regex' in literal;
}

export function isStringLiteralRegExp(literal: Literal & Rule.NodeParentExtension): boolean {
	return (
		literal.parent !== null &&
		literal.parent.type === 'NewExpression' &&
		literal.parent.callee.type === 'Identifier' &&
		literal.parent.callee.name === 'RegExp'
	);
}

export function isBinaryExpression(literal: Literal & Rule.NodeParentExtension): boolean {
	return literal.parent !== null && literal.parent.type === 'BinaryExpression';
}
