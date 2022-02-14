/**
 * Forked from original `no-restricted-imports` although the source has been substantially changed.
 *
 * To ensure compliance the license from eslint has been included and the original attribution.
 * @author Guy Ellis
 *
 * Copyright OpenJS Foundation and other contributors, <www.openjsf.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import type { Rule } from 'eslint';

import { restrictedPaths } from './paths';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'disallow specified modules when loaded by `import`',
      recommended: true,
      url: 'https://eslint.org/docs/rules/no-restricted-imports',
    },

    messages: {
      path: "'{{importSource}}' import is restricted from being used.",
      pathWithCustomMessage:
        "'{{importSource}}' import is restricted from being used. {{customMessage}}",

      everything:
        "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted.",
      everythingWithCustomMessage:
        "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted. {{customMessage}}",

      importName:
        "'{{importName}}' import from '{{importSource}}' is restricted.",
      importNameWithCustomMessage:
        "'{{importName}}' import from '{{importSource}}' is restricted. {{customMessage}}",
    },
  },

  create(context) {
    const restrictedPathMessages = restrictedPaths.reduce(
      (memo, importSource) => {
        if (typeof importSource === 'string') {
          memo[importSource] = { message: '' };
        } else {
          if ('message' in importSource) {
            memo[importSource.path] = {
              message: importSource.message,
            };
          }
          if ('imports' in importSource) {
            memo[importSource.path] = {
              // @ts-ignore
              imports: importSource.imports,
            };
          }
        }
        return memo;
      },
      {} as Record<
        string,
        {
          message?: string;
          imports?: {
            importName: string;
            message: string;
          }[];
        }
      >,
    );

    /**
     * Report a restricted path.
     * @param {string} importSource path of the import
     * @param {node} node representing the restricted path reference
     * @param {Map<string,Rule.Node>} importNames Map of import names that are being imported
     * @returns {void}
     * @private
     */
    function checkRestrictedPathAndReport(
      importSource: string,
      node: Rule.Node,
      importNames: Map<string, Rule.Node>,
    ) {
      if (
        !Object.prototype.hasOwnProperty.call(
          restrictedPathMessages,
          importSource,
        )
      ) {
        return;
      }

      const config = restrictedPathMessages[importSource];

      // The message will only exist if the import is completely banned,
      // eg a deprecated package
      if ('message' in config) {
        context.report({
          node,
          messageId: config.message ? 'pathWithCustomMessage' : 'path',
          data: {
            importSource,
            customMessage: config.message,
          } as any,
        });
      }

      // if there are specific named exports that are banned,
      // iterate through and check if they're being imported
      if ('imports' in config) {
        config.imports?.forEach((restrictedImport) => {
          if (importNames.has(restrictedImport.importName)) {
            context.report({
              node: importNames.get(restrictedImport.importName)!,
              message: restrictedImport.message,
            });
          }
        });
      }
    }

    /**
     * Checks a node to see if any problems should be reported.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    const checkNode = <ImportExportNode extends Rule.Node>(
      node: ImportExportNode,
    ) => {
      const importSource = (node as any).source.value.trim();
      const importNames = new Map<string, Rule.Node>();

      if ('specifiers' in node) {
        // @ts-ignore
        for (const specifier of node.specifiers) {
          let name;

          if (specifier.type === 'ImportDefaultSpecifier') {
            name = 'default';
          } else if (specifier.type === 'ImportNamespaceSpecifier') {
            name = '*';
          } else if (specifier.type === 'ImportSpecifier') {
            name = specifier.imported.name;
          } else if (specifier.local) {
            name = specifier.local.name;
          }

          if (name) {
            importNames.set(name, specifier as Rule.Node);
          }
        }
      }

      checkRestrictedPathAndReport(importSource, node, importNames);
    };

    return {
      ImportDeclaration: checkNode,
      ExportNamedDeclaration(node) {
        if (node.source) {
          checkNode(node);
        }
      },
    };
  },
};

export default rule;
