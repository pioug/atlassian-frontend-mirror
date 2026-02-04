import { type Binding, type NodePath, type Scope } from '@babel/traverse';
import * as t from '@babel/types';

import tokenNames from '../artifacts/token-names';
import light from '../artifacts/tokens-raw/atlassian-light';
import shape from '../artifacts/tokens-raw/atlassian-shape';
import spacing from '../artifacts/tokens-raw/atlassian-spacing';
import typography from '../artifacts/tokens-raw/atlassian-typography';

interface TokenMeta {
	value:
		| string
		| number
		| {
				radius: number;
				offset: { x: number; y: number };
				color: string;
				opacity: number;
		  }[]
		| {
				fontWeight: string;
				fontSize: string;
				lineHeight: string;
				fontFamily: string;
				fontStyle: string;
				letterSpacing: string;
		  };
	cleanName?: string;
}

const isExempted = (tokenName: string, exemptions: string[] = []): boolean => {
	// Check if the token name starts with any of the exempted prefixes
	for (const exemption of exemptions) {
		if (tokenName.startsWith(exemption)) {
			return true;
		}
	}

	return false;
};

// Convert raw tokens to key-value pairs { token: value }
const getThemeValues = (theme: TokenMeta[]): { [x: string]: string } => {
	return theme.reduce((formatted: { [x: string]: string }, rawToken) => {
		let value: string;

		if (typeof rawToken.value === 'string') {
			value = rawToken.value;
		} else if (typeof rawToken.value === 'number') {
			value = rawToken.value.toString();
		} else if (Array.isArray(rawToken.value)) {
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
		} else {
			// ignore when value is `fontweight` etc. - this is apparently not handled here.
			return formatted;
		}

		return { ...formatted, [rawToken.cleanName!]: value };
	}, {});
};

type DefaultColorTheme = 'light';

export default function plugin(): {
    visitor: {
        Program?: undefined;
    };
} | {
    visitor: {
        Program: {
            enter(path: NodePath<t.Program>, state: {
                opts: {
                    /**
                     * @default true
                     */
                    shouldUseAutoFallback?: boolean;
                    /**
                     * @default true
                     */
                    shouldForceAutoFallback?: boolean;
                    forceAutoFallbackExemptions?: string[];
                    defaultTheme?: DefaultColorTheme;
                };
            }): void;
            exit(path: NodePath<t.Program>): void;
        };
    };
} {
	// If the `TOKENS_SKIP_BABEL` environment variable is set, skip this
	// plugin entirely. This will be enabled when the native Tokens transformer is enabled.
	// This allows us to control this based on rollout gates.
	if (process.env.TOKENS_SKIP_BABEL === 'true') {
		return { visitor: {} };
	}

	return {
		visitor: {
			Program: {
				enter(
					path: NodePath<t.Program>,
					state: {
						opts: {
							/**
							 * @default true
							 */
							shouldUseAutoFallback?: boolean;
							/**
							 * @default true
							 */
							shouldForceAutoFallback?: boolean;
							forceAutoFallbackExemptions?: string[];
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
								throw new Error(`token() must have a string literal as the first argument`);
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
								if (state.opts.shouldUseAutoFallback !== false) {
									replacementNode = t.stringLiteral(
										`var(${cssTokenValue}, ${getDefaultFallback(tokenName)})`,
									);
								} else {
									replacementNode = t.stringLiteral(`var(${cssTokenValue})`);
								}
							}

							// The radius tokens are skipped in shouldForceAutoFallback mode because these tokens are not enabled in the live apps and enforcing default values on them will override all the fallback values that are currently being used to render the actual UI.
							// The exempted tokens (the ones that start with any of the provided exemption prefixes) are also skipped.
							const forceAutoFallbackExemptions = [
								'radius',
								...(state.opts.forceAutoFallbackExemptions || []),
							];

							// Handle fallbacks
							const fallback =
								state.opts.shouldForceAutoFallback !== false &&
								!isExempted(tokenName, forceAutoFallbackExemptions)
									? t.stringLiteral(getDefaultFallback(tokenName))
									: path.node.arguments[1];

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
const shapeValues = getThemeValues(shape);
const spacingValues = getThemeValues(spacing);
const typographyValues = getThemeValues(typography);

function getDefaultFallback(tokenName: keyof typeof lightValues): string {
	if (shapeValues[tokenName]) {
		return shapeValues[tokenName];
	}

	if (spacingValues[tokenName]) {
		return spacingValues[tokenName];
	}

	if (typographyValues[tokenName]) {
		return typographyValues[tokenName];
	}

	return lightValues[tokenName];
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
