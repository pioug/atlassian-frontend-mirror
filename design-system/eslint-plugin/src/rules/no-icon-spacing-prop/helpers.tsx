import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute, type JSXElement } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import * as ast from '../../ast-nodes';
import { Import } from '../../ast-nodes/import';

export const FLEX_IMPORT_MODULE = '@atlaskit/primitives/compiled';
export const FLEX_IMPORT_MODULE_NON_COMPILED = '@atlaskit/primitives';
export const TOKEN_IMPORT_MODULE = '@atlaskit/tokens';
export const CSS_IMPORT_MODULE = '@atlaskit/css';
export const CSSMAP_VARIABLE_NAME = 'iconSpacingStyles';

/**
 * Padding token mapping based on icon size and spacing value.
 * Same mapping as the codemod `icon-spacing-to-box-primitive`.
 */
export const SPACING_TO_PADDING: Record<string, Record<string, string>> = {
	medium: { compact: 'space.050', spacious: 'space.050' },
	small: { compact: 'space.025', spacious: 'space.075' },
};

/**
 * Maps a padding token to a cssMap key name.
 * e.g. 'space.050' → 'space050'
 */
export function getCssMapKey(paddingToken: string): string {
	return paddingToken.replace('space.', 'space');
}

/**
 * Returns the `spacing` JSXAttribute from an icon element, or undefined.
 */
export function getSpacingAttribute(node: JSXElement): JSXAttribute | undefined {
	if (!isNodeOfType(node.openingElement, 'JSXOpeningElement')) {
		return undefined;
	}
	return node.openingElement.attributes.find(
		(a): a is JSXAttribute => a.type === 'JSXAttribute' && a.name.name === 'spacing',
	);
}

/**
 * Returns the static string value of a JSXAttribute, or undefined if dynamic.
 */
export function getStaticAttributeValue(attr: JSXAttribute): string | undefined {
	if (attr.value && attr.value.type === 'Literal' && typeof attr.value.value === 'string') {
		return attr.value.value;
	}
	return undefined;
}

/**
 * Returns the static `size` prop value, defaulting to 'medium' if not present.
 */
export function getIconSize(node: JSXElement): string | undefined {
	if (!isNodeOfType(node.openingElement, 'JSXOpeningElement')) {
		return 'medium';
	}

	const sizeAttr = node.openingElement.attributes.find(
		(a): a is JSXAttribute => a.type === 'JSXAttribute' && a.name.name === 'size',
	);

	if (!sizeAttr) {
		return 'medium';
	}

	return getStaticAttributeValue(sizeAttr);
}

/**
 * Returns true if the element has any JSXSpreadAttribute.
 */
export function hasSpreadProps(node: JSXElement): boolean {
	return node.openingElement.attributes.some((a) => a.type === 'JSXSpreadAttribute');
}

/**
 * Upserts `Flex` from `@atlaskit/primitives/compiled`, handling:
 * 1. Already imported from `/compiled` → add Flex if missing
 * 2. Import from `@atlaskit/primitives` (non-compiled) → migrate path + add Flex
 * 3. No import → insert new `import { Flex } from '@atlaskit/primitives/compiled'`
 */
export function upsertFlexImport(
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	const root = getSourceCode(context).ast.body;

	const findExactImports = (module: string) =>
		root.filter(
			(node): node is import('eslint-codemod-utils').ImportDeclaration =>
				node.type === 'ImportDeclaration' && node.source.value === module,
		);

	const compiledImports = findExactImports(FLEX_IMPORT_MODULE);
	if (compiledImports.length > 0) {
		const decl = compiledImports[0];
		if (Import.containsNamedSpecifier(decl, 'Flex')) {
			return undefined;
		}
		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		specifiers.push('Flex');
		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${FLEX_IMPORT_MODULE}';`,
		);
	}

	const nonCompiledImports = findExactImports(FLEX_IMPORT_MODULE_NON_COMPILED);
	if (nonCompiledImports.length > 0) {
		const decl = nonCompiledImports[0];
		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		if (!specifiers.includes('Flex')) {
			specifiers.push('Flex');
		}
		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${FLEX_IMPORT_MODULE}';`,
		);
	}

	return ast.Root.upsertNamedImportDeclaration(
		{ module: FLEX_IMPORT_MODULE, specifiers: ['Flex'] },
		context,
		fixer,
	);
}

/**
 * Upserts `cssMap` from `@atlaskit/css`, handling:
 * 1. Already imported → no-op
 * 2. `@atlaskit/css` exists but missing `cssMap` → add specifier
 * 3. No import → insert new `import { cssMap } from '@atlaskit/css'`
 */
export function upsertCssMapImport(
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	const root = getSourceCode(context).ast.body;

	const cssImports = root.filter(
		(node): node is import('eslint-codemod-utils').ImportDeclaration =>
			node.type === 'ImportDeclaration' && node.source.value === CSS_IMPORT_MODULE,
	);

	if (cssImports.length > 0) {
		const decl = cssImports[0];
		const hasCssMap = Import.containsNamedSpecifier(decl, 'cssMap');

		if (hasCssMap) {
			return undefined;
		}

		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		if (!hasCssMap) {
			specifiers.push('cssMap');
		}

		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${CSS_IMPORT_MODULE}';`,
		);
	}

	return ast.Root.upsertNamedImportDeclaration(
		{ module: CSS_IMPORT_MODULE, specifiers: ['cssMap'] },
		context,
		fixer,
	);
}

/**
 * Upserts `token` from `@atlaskit/tokens`, handling:
 * 1. Already imported → no-op
 * 2. `@atlaskit/tokens` exists but missing `token` → add specifier
 * 3. No import → insert new `import { token } from '@atlaskit/tokens'`
 */
export function upsertTokenImport(
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	const root = getSourceCode(context).ast.body;

	const tokenImports = root.filter(
		(node): node is import('eslint-codemod-utils').ImportDeclaration =>
			node.type === 'ImportDeclaration' && node.source.value === TOKEN_IMPORT_MODULE,
	);

	if (tokenImports.length > 0) {
		const decl = tokenImports[0];
		if (Import.containsNamedSpecifier(decl, 'token')) {
			return undefined;
		}
		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		specifiers.push('token');
		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${TOKEN_IMPORT_MODULE}';`,
		);
	}

	return ast.Root.upsertNamedImportDeclaration(
		{ module: TOKEN_IMPORT_MODULE, specifiers: ['token'] },
		context,
		fixer,
	);
}

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
