import type { Rule, Scope } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';
import type { CallExpression } from 'estree';

import { CSS_IN_JS_IMPORTS } from './css-in-js-imports';
import { findIdentifierNode } from './find-identifier-node';

type Definition = Scope.Definition;
type Callee = CallExpression['callee'];
type Reference = Scope.Reference;

// A CSS-in-JS library an import of a valid css, cx, cssMap, etc.
// function might originate from, e.g. @compiled/react, @emotion/core.
export type ImportSource = string;

export type SupportedNameChecker = (
	nodeToCheck: Callee,
	referencesInScope: Reference[],
	importSources: ImportSource[],
) => boolean;

/**
 * By default all known import sources are checked against.
 */
export const DEFAULT_IMPORT_SOURCES: ImportSource[] = Object.values(CSS_IN_JS_IMPORTS);

/**
 * Given the ESLint rule context, extract and parse the value of the importSources rule option.
 * The importSources option is used to override which libraries an ESLint rule applies to.
 *
 * @param context The rule context.
 * @returns An array of strings representing what CSS-in-JS packages that should be checked, based
 *          on the rule options configuration.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getImportSources: (context: Rule.RuleContext) => ImportSource[] = (
	context: Rule.RuleContext,
): ImportSource[] => {
	// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
	const { options } = context as Omit<Rule.RuleContext, 'options'> & {
		options: Array<{ importSources?: ImportSource[] }>;
	};
	if (!options.length) {
		return DEFAULT_IMPORT_SOURCES;
	}

	if (options[0].importSources && Array.isArray(options[0].importSources)) {
		return options[0].importSources;
	}

	return DEFAULT_IMPORT_SOURCES;
};

const isSupportedImportWrapper = (
	functionName: string,
	defaultFromImportSources: ImportSource[] = [],
): SupportedNameChecker => {
	/**
	 * Checks whether:
	 *
	 * 1. A function name `nodeToCheck` matches the name of the function we
	 *    want to check for (e.g. `cx`, `css`, `cssMap`, or `keyframes`), and
	 * 2. Whether `nodeToCheck` originates from one of the libraries listed
	 *     in `importSources`.
	 *
	 * @param nodeToCheck The function callee we are checking (e.g. The `css` in `css()`).
	 * @param referencesInScope List of references that are in scope. We'll use this
	 *                          to check where the function callee is imported from.
	 * @param importSources List of libraries that we want to ensure `nodeToCheck`
	 *                      comes from.
	 *
	 * @returns Whether the above conditions are true.
	 */
	const isSupportedImport = (
		nodeToCheck: Callee,
		referencesInScope: Reference[],
		importSources: ImportSource[],
	): boolean => {
		return hasImportDefinition(
			getImportDefinitions(nodeToCheck, referencesInScope),
			functionName,
			importSources,
			defaultFromImportSources,
		);
	};

	return isSupportedImport;
};

// Unused functions have been commented out until we implement corresponding
// eslint rules which use them
//
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isCss: SupportedNameChecker = isSupportedImportWrapper('css');
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isCxFunction: SupportedNameChecker = isSupportedImportWrapper('cx');
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isCssMap: SupportedNameChecker = isSupportedImportWrapper('cssMap');
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isKeyframes: SupportedNameChecker = isSupportedImportWrapper('keyframes');
// `styled` is also the explicit default of `styled-components` and `@emotion/styled`, so we also match on default imports generally
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isStyled: SupportedNameChecker = isSupportedImportWrapper('styled', [
	'styled-components',
	'@emotion/styled',
]);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isXcss: SupportedNameChecker = isSupportedImportWrapper('xcss');

export type StyleFunctionName = 'css' | 'cssMap' | 'keyframes' | 'styled' | 'xcss';

const styleFunctionNames: StyleFunctionName[] = ['css', 'cssMap', 'keyframes', 'styled', 'xcss'];

/**
 * Resolve a style call once and return the matching API. This avoids repeatedly finding the
 * callee identifier and scanning every reference in the current scope for each supported API.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getStyleFunction(
	node: Callee,
	references: Reference[],
	importSources: ImportSource[],
	ignoreStyledInnerCall = false,
): StyleFunctionName | null {
	if (
		ignoreStyledInnerCall &&
		isNodeOfType(node, 'Identifier') &&
		(node.parent?.parent?.type === 'CallExpression' ||
			node.parent?.parent?.type === 'TaggedTemplateExpression')
	) {
		return null;
	}

	const definitions = getImportDefinitions(node, references);
	return (
		styleFunctionNames.find((functionName) =>
			hasImportDefinition(
				definitions,
				functionName,
				importSources,
				functionName === 'styled'
					? [CSS_IN_JS_IMPORTS.emotionStyled, CSS_IN_JS_IMPORTS.styledComponents]
					: [],
			),
		) ?? null
	);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const hasStyleObjectArguments: SupportedNameChecker = (node, references, importSources) =>
	getStyleFunction(node, references, importSources, true) !== null;

const importDefinitionsCache = new WeakMap<object, readonly Definition[] | null>();

function getImportDefinitions(node: Callee, references: Reference[]): readonly Definition[] | null {
	const identifierNode = findIdentifierNode(node);
	if (!identifierNode) {
		return null;
	}

	if (importDefinitionsCache.has(identifierNode)) {
		return importDefinitionsCache.get(identifierNode) ?? null;
	}

	const definitions =
		references.find((reference) => reference.identifier === identifierNode)?.resolved?.defs ?? null;
	importDefinitionsCache.set(identifierNode, definitions);
	return definitions;
}

function hasImportDefinition(
	definitions: readonly Definition[] | null,
	functionName: string,
	importSources: ImportSource[],
	defaultFromImportSources: ImportSource[] = [],
): boolean {
	return (
		definitions?.some((def) => {
			if (
				def.type !== 'ImportBinding' ||
				!def.parent ||
				!importSources.includes(def.parent.source.value as ImportSource)
			) {
				return false;
			}

			const isNamedImport =
				def.node.type === 'ImportSpecifier' &&
				def.node.imported.type === 'Identifier' &&
				def.node.imported.name === functionName;
			const isDefaultImportMatchingLocal =
				def.node.type === 'ImportDefaultSpecifier' && def.node.local.name === functionName;
			const isKnownDefaultImport =
				def.node.type === 'ImportDefaultSpecifier' &&
				defaultFromImportSources.includes(def.parent.source.value as ImportSource);

			return isNamedImport || isDefaultImportMatchingLocal || isKnownDefaultImport;
		}) ?? false
	);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isImportedFrom: (
	moduleName: string,
	exactMatch?: boolean,
) => (
	nodeToCheck: Callee,
	referencesInScope: Reference[],
	/**
	 * If we strictly have specific import sources in the config scope, pass them to make this more performant.
	 * Pass `null` if you don't care if its configured or not.
	 */
	importSources?: ImportSource[] | null,
) => boolean =
	(moduleName: string, exactMatch = true) =>
	(
		nodeToCheck: Callee,
		referencesInScope: Reference[],
		/**
		 * If we strictly have specific import sources in the config scope, pass them to make this more performant.
		 * Pass `null` if you don't care if its configured or not.
		 */
		importSources: ImportSource[] | null = null,
	): boolean => {
		if (
			importSources &&
			!importSources.some(
				(importSource) =>
					importSource === moduleName || (!exactMatch && importSource.startsWith(moduleName)),
			)
		) {
			// Don't go through the trouble of checking the import sources does not include this
			// We'll assume this is skipped elsewhere.
			return false;
		}

		const identifierNode = findIdentifierNode(nodeToCheck);

		return (
			identifierNode?.type === 'Identifier' &&
			referencesInScope.some(
				(reference) =>
					reference.identifier === identifierNode &&
					reference.resolved?.defs.some((def) => {
						return (
							def.type === 'ImportBinding' &&
							(def.parent?.source.value === moduleName ||
								(!exactMatch && String(def.parent?.source.value)?.startsWith(moduleName)))
						);
					}),
			)
		);
	};

/**
 * Determine if this node is specifically from a `'styled-components'` import.
 * This is because `styled-components@3.4` APIs are not consistent with Emotion and Compiled,
 * we need to handle them differently in a few scenarios.
 *
 * This can be cleaned up when `'styled-components'` is no longer a valid ImportSource.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isStyledComponents: (
	nodeToCheck: Callee,
	referencesInScope: Reference[],
	importSources?: ImportSource[] | null,
) => boolean = isImportedFrom('styled-components');
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isCompiled: (
	nodeToCheck: Callee,
	referencesInScope: Reference[],
	importSources?: ImportSource[] | null,
) => boolean = isImportedFrom('@compiled/', false);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isEmotion: (
	nodeToCheck: Callee,
	referencesInScope: Reference[],
	importSources?: ImportSource[] | null,
) => boolean = isImportedFrom('@emotion/', false);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isAtlasKitCSS: (
	nodeToCheck: Callee,
	referencesInScope: Reference[],
	importSources?: ImportSource[] | null,
) => boolean = isImportedFrom('@atlaskit/css', false);

export { CSS_IN_JS_IMPORTS } from './css-in-js-imports';
