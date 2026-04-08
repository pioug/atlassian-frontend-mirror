import { type CallExpression, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

function isCallExpressionCalleeImportType(callee: CallExpression['callee']) {
	return callee && callee.type === 'Import';
}

function isCallExpressionArgumentStringLiteralType(
	callExpressionArguments: CallExpression['arguments'],
) {
	return (
		callExpressionArguments &&
		callExpressionArguments.length &&
		callExpressionArguments[0].type === 'StringLiteral'
	);
}

function isCallExpressionArgumentValueMatches(
	callExpressionArgument: CallExpression['arguments'][0],
	j: JSCodeshift,
	value: string,
) {
	return j(callExpressionArgument).some((path) => path.node.value === value);
}

export function getDynamicImportCollection(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
): Collection<CallExpression> {
	return collection.find(j.CallExpression).filter((callExpressionPath) => {
		const { callee, arguments: callExpressionArguments } = callExpressionPath.node;

		return !!(
			isCallExpressionCalleeImportType(callee) &&
			isCallExpressionArgumentStringLiteralType(callExpressionArguments) &&
			isCallExpressionArgumentValueMatches(callExpressionArguments[0], j, importPath)
		);
	});
}
