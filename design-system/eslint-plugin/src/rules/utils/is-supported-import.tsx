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

    return (
      // import { functionName } from 'import-source';
      (def.node.type === 'ImportSpecifier' &&
        def.node.imported.name === functionName) ||
      // import functionName from 'import-source';
      (def.node.type === 'ImportDefaultSpecifier' &&
        def.node.local.name === functionName)
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
    return (
      nodeToCheck.type === 'Identifier' &&
      referencesInScope.some(
        (reference) =>
          reference.identifier === nodeToCheck &&
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
export const isStyled = isSupportedImportWrapper('styled');
