import {
	callExpression,
	type Expression,
	identifier,
	type Identifier,
	literal,
	type MemberExpression,
	memberExpression,
	type Property,
	property,
	type SpreadElement,
	type StringableASTNode,
} from 'eslint-codemod-utils';

function createMemberExpressionFromArray(
	array: string[],
): StringableASTNode<MemberExpression | Identifier> {
	if (array.length === 1) {
		return identifier(array[0]);
	}
	const property = array.pop();

	return memberExpression({
		object: createMemberExpressionFromArray(array),
		property: identifier(property!),
	});
}

function getTokenNode(
	tokenName: string,
	fallbackValue?: string,
	isFallbackMember: boolean = false,
) {
	const callExpressionArgs: (Expression | SpreadElement)[] = [
		literal({
			value: `'${tokenName}'`,
		}),
	];

	if (fallbackValue) {
		const fallback = isFallbackMember
			? createMemberExpressionFromArray(fallbackValue.split('.'))
			: literal(fallbackValue);

		callExpressionArgs.push(fallback);
	}

	return callExpression({
		callee: identifier({ name: 'token' }),
		arguments: callExpressionArgs,
		optional: false,
	});
}

export function getTokenProperty(
	propertyName: string,
	tokenName: string,
	tokenFallback?: string,
	isFallbackMember: boolean = false,
): StringableASTNode<Property> {
	return property({
		key: identifier(propertyName),
		value: getTokenNode(tokenName, tokenFallback, isFallbackMember),
	});
}
