// This should be kept in sync with
// packages/design-system/eslint-plugin-ui-styling-standard/src/rules/utils/is-supported-import.tsx
// whenever possible.
//
// TODO: would having an @atlassian/eslint-plugin-design-system-common
// package be useful?

// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule, Scope } from 'eslint';
import type { CallExpression } from 'estree';

type Definition = Scope.Definition;
type Callee = CallExpression['callee'];
type Reference = Scope.Reference;

export const CSS_IN_JS_IMPORTS = {
  compiled: '@compiled/react',
  emotionReact: '@emotion/react',
  emotionCore: '@emotion/core',
  emotionStyled: '@emotion/styled',
  styledComponents: 'styled-components',
  atlaskitCss: '@atlaskit/css',
  atlaskitPrimitives: '@atlaskit/primitives',
} as const;

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
export const DEFAULT_IMPORT_SOURCES: ImportSource[] =
  Object.values(CSS_IN_JS_IMPORTS);

const getIdentifierNode = (node: Callee) => {
  let identifierNode = node.type === 'Identifier' ? node : undefined;
  if (!identifierNode) {
    // Handles styled.div`` case
    if (node.type === 'MemberExpression' && node.object.type === 'Identifier') {
      identifierNode = node.object;
    }

    // Handles styled(Component)`` case
    if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
      identifierNode = node.callee;
    }
  }
  return identifierNode;
};

/**
 * Given the ESLint rule context, extract and parse the value of the importSources rule option.
 * The importSources option is used to override which libraries an ESLint rule applies to.
 *
 * @param context The rule context.
 * @returns An array of strings representing what CSS-in-JS packages that should be checked, based
 *          on the rule options configuration.
 */
export const getImportSources = (context: Rule.RuleContext): ImportSource[] => {
  const options = context.options;
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
  const checkDefinitionHasImport = (
    def: Definition,
    importSources: ImportSource[],
  ) => {
    if (def.type !== 'ImportBinding') {
      return false;
    }

    if (
      !def.parent ||
      !importSources.includes(def.parent.source.value as ImportSource)
    ) {
      return false;
    }

    // Matches the imported name from a named import
    // import { functionName, functioName as otherName } from 'import-source';
    const isNamedImport =
      def.node.type === 'ImportSpecifier' &&
      def.node.imported.name === functionName;

    // Must explicitly match the local name from a default import
    // import functionName from 'import-source';
    const isDefaultImportMatchingLocal =
      def.node.type === 'ImportDefaultSpecifier' &&
      def.node.local.name === functionName;

    // Can match any local name from a default import
    // import anything from 'import-source'
    const isKnownDefaultImport =
      def.node.type === 'ImportDefaultSpecifier' &&
      defaultFromImportSources.includes(
        def.parent.source.value as ImportSource,
      );

    return (
      isNamedImport || isDefaultImportMatchingLocal || isKnownDefaultImport
    );
  };

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
    const identifierNode = getIdentifierNode(nodeToCheck);

    return (
      identifierNode?.type === 'Identifier' &&
      referencesInScope.some(
        (reference) =>
          reference.identifier === identifierNode &&
          reference.resolved?.defs.some((def) =>
            checkDefinitionHasImport(def, importSources),
          ),
      )
    );
  };

  return isSupportedImport;
};

// Unused functions have been commented out until we implement corresponding
// eslint rules which use them
//
export const isCss = isSupportedImportWrapper('css');
export const isCxFunction = isSupportedImportWrapper('cx');
export const isCssMap = isSupportedImportWrapper('cssMap');
export const isKeyframes = isSupportedImportWrapper('keyframes');
// `styled` is also the explicit default of `styled-components` and `@emotion/styled`, so we also match on default imports generally
export const isStyled = isSupportedImportWrapper('styled', [
  'styled-components',
  '@emotion/styled',
]);
export const isXcss = isSupportedImportWrapper('xcss');

export const isImportedFrom =
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
          importSource === moduleName ||
          (!exactMatch && importSource.startsWith(moduleName)),
      )
    ) {
      // Don't go through the trouble of checking the import sources does not include this
      // We'll assume this is skipped elsewhere.
      return false;
    }

    const identifierNode = getIdentifierNode(nodeToCheck);

    return (
      identifierNode?.type === 'Identifier' &&
      referencesInScope.some(
        (reference) =>
          reference.identifier === identifierNode &&
          reference.resolved?.defs.some((def) => {
            return (
              def.type === 'ImportBinding' &&
              (def.parent?.source.value === moduleName ||
                (!exactMatch &&
                  String(def.parent?.source.value)?.startsWith(moduleName)))
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
export const isStyledComponents = isImportedFrom('styled-components');
export const isCompiled = isImportedFrom('@compiled/', false);
export const isEmotion = isImportedFrom('@emotion/', false);
