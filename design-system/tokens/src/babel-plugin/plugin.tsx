import { Binding, NodePath, Scope } from '@babel/traverse';
import * as t from '@babel/types';

import tokenDefaultValues from '../artifacts/token-default-values';
import tokenNames from '../artifacts/token-names';

export default function plugin() {
  return {
    visitor: {
      CallExpression(
        path: NodePath<t.CallExpression>,
        state: { opts: { shouldUseAutoFallback?: boolean } },
      ) {
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
          throw new Error(
            `token() does not accept ${path.node.arguments.length} arguments`,
          );
        }

        // Check the token exists
        const tokenName = path.node.arguments[0]
          .value as keyof typeof tokenNames;
        const cssTokenValue = tokenNames[tokenName];
        if (!cssTokenValue) {
          throw new Error(`token '${tokenName}' does not exist`);
        }

        var replacementNode: t.Node | undefined;

        // if no fallback is set, optionally find one from the default theme
        if (path.node.arguments.length < 2) {
          if (state.opts.shouldUseAutoFallback) {
            replacementNode = t.stringLiteral(
              `var(${cssTokenValue}, ${getDefaultFallback(tokenName)})`,
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
      Program: {
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
                const binding =
                  path.scope.bindings[getAliasedImportName(specifier.node)];

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

function getDefaultFallback(
  tokenName: keyof typeof tokenDefaultValues,
): string {
  return tokenDefaultValues[tokenName];
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
function getTokenImportScope(
  path: NodePath<t.CallExpression>,
): Scope | undefined {
  const callee = path.node.callee;
  if (!t.isIdentifier(callee)) {
    return undefined;
  }
  const binding = getTokenBinding(path.scope, callee.name);

  if (!binding || !t.isImportSpecifier(binding.path.node)) {
    return undefined;
  }

  return getNonAliasedImportName(binding.path.node) === 'token'
    ? binding.scope
    : undefined;
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
