import type { API, ASTPath, Collection, FileInfo, JSXElement, default as core } from 'jscodeshift';

const ICON_PACKAGES = ['@atlaskit/icon/core', '@atlaskit/icon-lab/core'];
const FLEX_COMPILED_PACKAGE = '@atlaskit/primitives/compiled';
const FLEX_NON_COMPILED_PACKAGE = '@atlaskit/primitives';
const TOKEN_PACKAGE = '@atlaskit/tokens';
const CSS_PACKAGE = '@atlaskit/css';
const CSSMAP_VARIABLE_NAME = 'iconSpacingStyles';

/**
 * Spacing → Flex padding token mapping.
 *
 * medium/unspecified:
 *   compact  → space.050 (4px)
 *   spacious → space.050 (4px)
 *
 * small:
 *   compact  → space.025 (2px) — NOTE: 2.66px doesn't map cleanly; confirm with designer
 *   spacious → space.075 (6px)
 */
const SPACING_TO_PADDING: Record<string, Record<string, string>> = {
	medium: {
		compact: 'space.050',
		spacious: 'space.050',
	},
	small: {
		compact: 'space.025',
		spacious: 'space.075',
	},
};

/**
 * Maps a padding token to a cssMap key name.
 * e.g. 'space.050' → 'space050'
 */
function getCssMapKey(paddingToken: string): string {
	return paddingToken.replace('space.', 'space');
}

function getIconImportSpecifiers(j: core.JSCodeshift, source: Collection<any>): string[] {
	const specifiers: string[] = [];
	for (const pkg of ICON_PACKAGES) {
		source
			.find(j.ImportDeclaration)
			.filter(
				(path) =>
					typeof path.node.source.value === 'string' && path.node.source.value.startsWith(pkg),
			)
			.forEach((importDecl) => {
				for (const specifier of importDecl.value.specifiers || []) {
					if (specifier.local?.name) {
						specifiers.push(specifier.local.name);
					}
				}
			});
	}
	return specifiers;
}

function ensureNamedImport(j: core.JSCodeshift, specifiers: any[], name: string): void {
	const alreadyImported = specifiers.some(
		(s) => s.type === 'ImportSpecifier' && s.imported?.name === name,
	);
	if (!alreadyImported) {
		specifiers.push(j.importSpecifier(j.identifier(name)));
	}
}

/**
 * Ensures `Flex` is imported from `@atlaskit/primitives/compiled`.
 * - If `/compiled` already exists → add `Flex` if missing
 * - If `@atlaskit/primitives` (non-compiled) exists → migrate path to `/compiled`, add `Flex`
 * - Otherwise → insert new import
 */
function insertFlexImport(j: core.JSCodeshift, source: Collection<any>): void {
	const compiledImports = source
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === FLEX_COMPILED_PACKAGE);

	if (compiledImports.length > 0) {
		compiledImports.forEach((path) => {
			ensureNamedImport(j, path.node.specifiers || [], 'Flex');
		});
		return;
	}

	const nonCompiledImports = source
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === FLEX_NON_COMPILED_PACKAGE);

	if (nonCompiledImports.length > 0) {
		nonCompiledImports.forEach((path) => {
			path.node.source = j.stringLiteral(FLEX_COMPILED_PACKAGE);
			ensureNamedImport(j, path.node.specifiers || [], 'Flex');
		});
		return;
	}

	const newImport = j.importDeclaration(
		[j.importSpecifier(j.identifier('Flex'))],
		j.stringLiteral(FLEX_COMPILED_PACKAGE),
	);
	source.get().node.program.body.unshift(newImport);
}

/**
 * Ensures `cssMap` is imported from `@atlaskit/css`.
 * Note: `jsx` import and JSX pragma are NOT needed for cssMap — only for cx().
 * - If `@atlaskit/css` already exists → add `cssMap` if missing
 * - Otherwise → insert new import
 */
function insertCssMapImport(j: core.JSCodeshift, source: Collection<any>): void {
	const cssImports = source
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === CSS_PACKAGE);

	if (cssImports.length > 0) {
		cssImports.forEach((path) => {
			ensureNamedImport(j, path.node.specifiers || [], 'cssMap');
		});
		return;
	}

	const newImport = j.importDeclaration(
		[j.importSpecifier(j.identifier('cssMap'))],
		j.stringLiteral(CSS_PACKAGE),
	);
	source.get().node.program.body.unshift(newImport);
}

/**
 * Ensures `token` is imported from `@atlaskit/tokens`.
 */
function insertTokenImport(j: core.JSCodeshift, source: Collection<any>): void {
	const tokenImports = source
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === TOKEN_PACKAGE);

	if (tokenImports.length > 0) {
		tokenImports.forEach((path) => {
			ensureNamedImport(j, path.node.specifiers || [], 'token');
		});
		return;
	}

	const newImport = j.importDeclaration(
		[j.importSpecifier(j.identifier('token'))],
		j.stringLiteral(TOKEN_PACKAGE),
	);
	source.get().node.program.body.unshift(newImport);
}

/**
 * Inserts or updates a single `const iconSpacingStyles = cssMap({...})` declaration
 * at module level (after the last import), with one key per padding token used.
 *
 * If the variable already exists, adds missing keys to the existing cssMap object.
 */
function insertOrUpdateCssMapVariable(
	j: core.JSCodeshift,
	source: Collection<any>,
	paddingTokens: Set<string>,
): void {
	// Check if iconSpacingStyles already exists
	const existing = source.find(j.VariableDeclaration).filter((path) => {
		const decl = path.node.declarations[0];
		return decl?.type === 'VariableDeclarator' && (decl.id as any)?.name === CSSMAP_VARIABLE_NAME;
	});

	if (existing.length > 0) {
		// Add missing keys to the existing cssMap object
		existing.forEach((path) => {
			const decl = path.node.declarations[0] as any;
			const cssMapCall = decl?.init;
			if (cssMapCall?.type !== 'CallExpression') {
				return;
			}
			const objExpr = cssMapCall.arguments[0];
			if (objExpr?.type !== 'ObjectExpression') {
				return;
			}

			const existingKeys = new Set(
				objExpr.properties.filter((p: any) => p.key).map((p: any) => p.key.name || p.key.value),
			);

			for (const paddingToken of Array.from(paddingTokens).sort()) {
				const key = getCssMapKey(paddingToken);
				if (!existingKeys.has(key)) {
					const tokenCall = () =>
						j.callExpression(j.identifier('token'), [j.stringLiteral(paddingToken)]);
					objExpr.properties.push(
						j.objectProperty(
							j.identifier(key),
							j.objectExpression([
								j.objectProperty(j.identifier('paddingBlock'), tokenCall()),
								j.objectProperty(j.identifier('paddingInline'), tokenCall()),
							]),
						),
					);
				}
			}
		});
		return;
	}

	// Build new cssMap variable declaration with all keys
	const properties = Array.from(paddingTokens)
		.sort()
		.map((paddingToken) => {
			const tokenCall = () =>
				j.callExpression(j.identifier('token'), [j.stringLiteral(paddingToken)]);
			return j.objectProperty(
				j.identifier(getCssMapKey(paddingToken)),
				j.objectExpression([
					j.objectProperty(j.identifier('paddingBlock'), tokenCall()),
					j.objectProperty(j.identifier('paddingInline'), tokenCall()),
				]),
			);
		});

	const cssMapCall = j.callExpression(j.identifier('cssMap'), [j.objectExpression(properties)]);

	const variableDecl = j.variableDeclaration('const', [
		j.variableDeclarator(j.identifier(CSSMAP_VARIABLE_NAME), cssMapCall),
	]);

	// Insert after the last import
	const body = source.get().node.program.body;
	let insertIndex = 0;
	for (let i = body.length - 1; i >= 0; i--) {
		if (body[i].type === 'ImportDeclaration') {
			insertIndex = i + 1;
			break;
		}
	}
	body.splice(insertIndex, 0, variableDecl);
}

/**
 * Wraps a JSXElement in <Flex xcss={iconSpacingStyles.spaceXXX}>...</Flex>.
 */
function wrapWithFlex(j: core.JSCodeshift, iconElement: JSXElement, paddingToken: string) {
	const key = getCssMapKey(paddingToken);
	return j.jsxElement(
		j.jsxOpeningElement(j.jsxIdentifier('Flex'), [
			j.jsxAttribute(
				j.jsxIdentifier('xcss'),
				j.jsxExpressionContainer(
					j.memberExpression(j.identifier(CSSMAP_VARIABLE_NAME), j.identifier(key)),
				),
			),
		]),
		j.jsxClosingElement(j.jsxIdentifier('Flex')),
		[iconElement],
	);
}

function addEslintDisableComment(
	j: core.JSCodeshift,
	path: ASTPath<JSXElement>,
	reason: string,
): void {
	const comment = j.line(
		` eslint-disable-next-line @atlaskit/design-system/no-icon-spacing-prop -- TODO: ${reason}`,
	);
	const node = path.value as any;
	node.comments = [comment, ...(node.comments || [])];
}

function getStaticPropValue(attributes: any[], propName: string): string | null {
	const prop = attributes.find(
		(attr: any) => attr.type === 'JSXAttribute' && attr.name?.name === propName,
	);
	if (!prop) {
		return null;
	}
	if (prop.value?.type === 'StringLiteral' || prop.value?.type === 'Literal') {
		return prop.value.value;
	}
	return null;
}

function hasSpreadAttributes(attributes: any[]): boolean {
	return attributes.some((attr: any) => attr.type === 'JSXSpreadAttribute');
}

function isSpacingDynamic(attributes: any[]): boolean {
	const prop = attributes.find(
		(attr: any) => attr.type === 'JSXAttribute' && attr.name?.name === 'spacing',
	);
	if (!prop) {
		return false;
	}
	return prop.value?.type !== 'StringLiteral' && prop.value?.type !== 'Literal';
}

function removeSpacingProp(attributes: any[]): any[] {
	return attributes.filter(
		(attr: any) => !(attr.type === 'JSXAttribute' && attr.name?.name === 'spacing'),
	);
}

function replaceWithWrapped(
	j: core.JSCodeshift,
	path: ASTPath<JSXElement>,
	wrappedElement: JSXElement,
): void {
	const node = path.value as any;

	const leadingComments = node.comments?.filter((c: any) => c.leading) || [];
	if (leadingComments.length) {
		node.comments = node.comments?.filter((c: any) => !c.leading);
		(wrappedElement as any).comments = [
			...leadingComments,
			...((wrappedElement as any).comments || []),
		];
	}

	const parentNode = path.parent?.node;
	const isInsideJSX =
		parentNode?.type === 'JSXElement' ||
		parentNode?.type === 'JSXFragment' ||
		parentNode?.type === 'JSXExpressionContainer';

	const isParenthesized =
		!isInsideJSX &&
		parentNode &&
		(parentNode.type === 'ParenthesizedExpression' || parentNode.extra?.parenthesized);

	if (isParenthesized) {
		j(path.parent).replaceWith(wrappedElement);
	} else {
		j(path).replaceWith(wrappedElement);
	}
}

export default function transformer(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const source = j(file.source);

	const iconSpecifiers = getIconImportSpecifiers(j, source);
	if (!iconSpecifiers.length) {
		return file.source;
	}

	const iconJSXWithSpacing = source
		.find(j.JSXElement)
		.filter((path) => {
			const name = path.value.openingElement.name;
			return name.type === 'JSXIdentifier' && iconSpecifiers.includes(name.name);
		})
		.filter((path) =>
			(path.value.openingElement.attributes || []).some(
				(attr: any) => attr.type === 'JSXAttribute' && attr.name?.name === 'spacing',
			),
		);

	if (!iconJSXWithSpacing.length) {
		return file.source;
	}

	const paddingTokensUsed = new Set<string>();
	let needsFlexImport = false;

	iconJSXWithSpacing.forEach((path) => {
		const attrs = path.value.openingElement.attributes || [];

		if (hasSpreadAttributes(attrs)) {
			addEslintDisableComment(
				j,
				path,
				'Manually migrate spacing prop to Flex primitive (spread props detected)',
			);
			return;
		}

		if (isSpacingDynamic(attrs)) {
			addEslintDisableComment(
				j,
				path,
				'Manually migrate spacing prop to Flex primitive (dynamic spacing value detected)',
			);
			return;
		}

		const spacingValue = getStaticPropValue(attrs, 'spacing')!;
		path.value.openingElement.attributes = removeSpacingProp(attrs);

		if (spacingValue === 'none') {
			return;
		}

		const sizeValue = getStaticPropValue(attrs, 'size') ?? 'medium';
		const sizeKey = sizeValue === 'small' ? 'small' : 'medium';
		const paddingToken = SPACING_TO_PADDING[sizeKey]?.[spacingValue];

		if (!paddingToken) {
			addEslintDisableComment(
				j,
				path,
				`Manually migrate spacing="${spacingValue}" prop to Flex primitive (unknown spacing value)`,
			);
			return;
		}

		if ((path.value as any).extra) {
			(path.value as any).extra.parenthesized = false;
		}

		const wrappedElement = wrapWithFlex(j, path.value, paddingToken);
		replaceWithWrapped(j, path, wrappedElement);

		needsFlexImport = true;
		paddingTokensUsed.add(paddingToken);
	});

	if (needsFlexImport) {
		// Insert in reverse order since each unshift prepends — last inserted appears first
		// Desired order: @atlaskit/css, @atlaskit/primitives/compiled, @atlaskit/tokens
		insertTokenImport(j, source);
		insertFlexImport(j, source);
		insertCssMapImport(j, source);
		insertOrUpdateCssMapVariable(j, source, paddingTokensUsed);
	}

	return source.toSource();
}
