import { type Binding, type NodePath, type Scope } from '@babel/traverse';
import * as t from '@babel/types';

import tokenNames from '../artifacts/token-names';
import legacyLight from '../artifacts/tokens-raw/atlassian-legacy-light';
import light from '../artifacts/tokens-raw/atlassian-light';
import shape from '../artifacts/tokens-raw/atlassian-shape';
import spacing from '../artifacts/tokens-raw/atlassian-spacing';
import typography from '../artifacts/tokens-raw/atlassian-typography-adg3';

interface TokenMeta {
	value:
		| string
		| number
		| {
				radius: number;
				offset: { x: number; y: number };
				color: string;
				opacity: number;
		  }[];
	cleanName: string;
}

// Convert raw tokens to key-value pairs { token: value }
const getThemeValues = (theme: TokenMeta[]): { [x: string]: string } => {
	return theme.reduce((formatted: { [x: string]: string }, rawToken) => {
		let value: string;

		if (typeof rawToken.value === 'string') {
			value = rawToken.value;
		} else if (typeof rawToken.value === 'number') {
			value = rawToken.value.toString();
		} else {
			// If it's a box shadow, it'll be an array of values that needs to be
			// formatted to look like '0px 0px 8px #091e4229, 0px 0px 1px #091e421F'
			value = rawToken.value.reduce((prev, curr, index) => {
				let color = curr.color;

				// Opacity needs to be added to hex values that don't already contain it.
				// If it contained opacity, the length would be 9 instead of 7.
				if (color.length === 7 && curr.opacity) {
					const opacityAsHex = curr.opacity.toString(16); // 0.4f5c28f5c28f5c
					let shortenedHex = opacityAsHex.slice(2, 4); // 4f

					// The hex value has to have a length of 2. If it's shorter, a "0" needs to be added.
					if (shortenedHex.length === 1) {
						shortenedHex += '0';
					}

					color += shortenedHex;
				}

				let value = `${curr.offset.x}px ${curr.offset.y}px ${curr.radius}px ${color}`;

				if (index === 0) {
					value += `, `;
				}

				return prev + value;
			}, '');
		}

		return { ...formatted, [rawToken.cleanName]: value };
	}, {});
};

type DefaultColorTheme = 'light' | 'legacy-light';

export default function plugin() {
	return {
		visitor: {
			Program: {
				enter(
					path: NodePath<t.Program>,
					state: {
						opts: {
							shouldUseAutoFallback?: boolean;
							defaultTheme?: DefaultColorTheme;
						};
					},
				) {
					// @ts-expect-error TS2339: Property 'file' does not exist on type 'Hub'
					const sourceFile = path.hub.file.opts.filename;
					if (sourceFile && sourceFile.includes('node_modules')) {
						return;
					}

					path.traverse({
						CallExpression(path: NodePath<t.CallExpression>) {
							const tokenImportScope = getTokenImportScope(path);
							if (!tokenImportScope) {
								return;
							}

							// Check arguments have correct format
							if (!path.node.arguments[0]) {
								throw new Error(`token() requires at least one argument`);
							} else if (!t.isStringLiteral(path.node.arguments[0])) {
								throw new Error(`token() must have a string as the first argument`);
							} else if (path.node.arguments.length > 2) {
								throw new Error(`token() does not accept ${path.node.arguments.length} arguments`);
							}

							// Check the token exists
							const tokenName = path.node.arguments[0].value as keyof typeof tokenNames;
							const cssTokenValue = tokenNames[tokenName];
							if (!cssTokenValue) {
								throw new Error(`token '${tokenName}' does not exist`);
							}

							var replacementNode: t.Node | undefined;

							// if no fallback is set, optionally find one from the default theme
							if (path.node.arguments.length < 2) {
								if (state.opts.shouldUseAutoFallback) {
									replacementNode = t.stringLiteral(
										`var(${cssTokenValue}, ${getDefaultFallback(
											tokenName,
											state.opts.defaultTheme,
										)})`,
									);
								} else {
									replacementNode = t.stringLiteral(`var(${cssTokenValue})`);
								}
							}

							// Handle fallbacks
							const fallback = path.node.arguments[1];

							if (t.isStringLiteral(fallback)) {
								// String literals can be concatenated into css variable call
								// Empty string fallbacks are ignored. For now, as the user did specify a fallback, no default is inserted
								replacementNode = t.stringLiteral(
									fallback.value
										? `var(${cssTokenValue}, ${fallback.value})`
										: `var(${cssTokenValue})`,
								);
							} else if (t.isExpression(fallback)) {
								// Expressions should be placed in a template string/literal
								replacementNode = t.templateLiteral(
									[
										t.templateElement(
											{
												cooked: `var(${cssTokenValue}, `,
												// Currently we create a "raw" value by inserting escape characters via regex (https://github.com/babel/babel/issues/9242)
												raw: `var(${cssTokenValue.replace(/\\|`|\${/g, '\\$&')}, `,
											},
											false,
										),
										t.templateElement({ raw: ')', cooked: ')' }, true),
									],
									[fallback],
								);
							}

							// Replace path and call scope.crawl() to refresh the scope bindings + references
							replacementNode && path.replaceWith(replacementNode);
							// @ts-ignore crawl is a valid property
							tokenImportScope.crawl();
						},
					});
				},
				exit(path: NodePath<t.Program>) {
					path.traverse({
						ImportDeclaration(path) {
							// remove import of 'token'
							if (path.node.source.value !== '@atlaskit/tokens') {
								return;
							}

							path.get('specifiers').forEach((specifier) => {
								if (!specifier.isImportSpecifier()) {
									return;
								}
								if (getNonAliasedImportName(specifier.node) !== 'token') {
									return;
								}
								const binding = path.scope.bindings[getAliasedImportName(specifier.node)];

								// if no longer used, remove
								if (!binding.referenced) {
									specifier.remove();
								}
							});

							// remove '@atlaskit/tokens' import if it is no longer needed
							if (path.get('specifiers').length === 0) {
								path.remove();
							}
						},
					});
				},
			},
		},
	};
}

const lightValues = getThemeValues(light);
const legacyLightValues = getThemeValues(legacyLight);
const shapeValues = getThemeValues(shape);
const spacingValues = getThemeValues(spacing);
const typographyValues = getThemeValues(typography);

function getDefaultFallback(
	tokenName: keyof typeof lightValues,
	theme: DefaultColorTheme = 'light',
): string {
	if (shapeValues[tokenName]) {
		return shapeValues[tokenName];
	}

	if (spacingValues[tokenName]) {
		return spacingValues[tokenName];
	}

	if (typographyValues[tokenName]) {
		return typographyValues[tokenName];
	}

	const colorValues = theme === 'legacy-light' ? legacyLightValues : lightValues;

	return colorValues[tokenName];
}

function getNonAliasedImportName(node: t.ImportSpecifier): string {
	if (t.isIdentifier(node.imported)) {
		return node.imported.name;
	}
	return node.imported.value;
}

function getAliasedImportName(node: t.ImportSpecifier): string {
	return node.local.name;
}

/**
 * Determine if the current call is to a token function, and
 * return the relevant scope
 */
function getTokenImportScope(path: NodePath<t.CallExpression>): Scope | undefined {
	const callee = path.node.callee;
	if (!t.isIdentifier(callee)) {
		return undefined;
	}
	const binding = getTokenBinding(path.scope, callee.name);

	if (!binding || !t.isImportSpecifier(binding.path.node)) {
		return undefined;
	}

	if (binding.path.parent && t.isImportDeclaration(binding.path.parent)) {
		if (binding.path.parent.source.value !== '@atlaskit/tokens') {
			return undefined;
		}
	}

	return getNonAliasedImportName(binding.path.node) === 'token' ? binding.scope : undefined;
}

function getTokenBinding(scope: Scope, name: string): Binding | undefined {
	if (!scope) {
		return undefined;
	}

	if (scope.bindings[name]) {
		return scope.bindings[name];
	} else {
		return getTokenBinding(scope.parent, name);
	}
}
