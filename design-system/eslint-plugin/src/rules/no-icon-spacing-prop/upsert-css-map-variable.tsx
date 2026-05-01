import type { Rule } from 'eslint';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { getCssMapKey } from './get-css-map-key';

const CSSMAP_VARIABLE_NAME = 'iconSpacingStyles';

/**
 * Inserts or updates `const iconSpacingStyles = cssMap({ spaceXXX: { padding: token('space.XXX') } })`
 * after the last import statement.
 *
 * If `iconSpacingStyles` already exists, adds the new key to the existing cssMap object.
 * If it doesn't exist, inserts a new declaration after the last import.
 */
export function upsertCssMapVariable(
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
	paddingToken: string,
): Rule.Fix | undefined {
	const sourceCode = getSourceCode(context);
	const body = sourceCode.ast.body;
	const key = getCssMapKey(paddingToken);
	const keyValuePair = `  ${key}: { paddingBlock: token('${paddingToken}'), paddingInline: token('${paddingToken}') }`;

	// Check if iconSpacingStyles cssMap variable already exists
	const existingVar = body.find(
		(node) =>
			node.type === 'VariableDeclaration' &&
			node.declarations[0]?.type === 'VariableDeclarator' &&
			(node.declarations[0].id as any)?.name === CSSMAP_VARIABLE_NAME,
	);

	if (existingVar) {
		// Check if the key already exists in the cssMap
		const varText = sourceCode.getText(existingVar);
		if (varText.includes(key + ':') || varText.includes(`'${key}'`)) {
			return undefined;
		}
		// Add the key to the existing cssMap — insert before the closing }
		const closingBrace = sourceCode.getText(existingVar).lastIndexOf('}');
		const existingVarStart = existingVar.range![0];
		return fixer.insertTextAfterRange(
			[existingVarStart, existingVarStart + closingBrace],
			`,\n${keyValuePair}\n`,
		);
	}

	// Find last import to insert after it
	const lastImport = [...body].reverse().find((n) => n.type === 'ImportDeclaration');

	const declaration = `\nconst ${CSSMAP_VARIABLE_NAME} = cssMap({\n${keyValuePair},\n});`;

	if (lastImport) {
		return fixer.insertTextAfter(lastImport, declaration);
	}

	// No imports — insert at the start of the file
	const firstNode = body[0];
	if (firstNode) {
		return fixer.insertTextBefore(firstNode, declaration);
	}

	return undefined;
}
