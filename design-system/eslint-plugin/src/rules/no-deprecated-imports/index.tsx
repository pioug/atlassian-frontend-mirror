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

import { TSESLint, TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/create-rule';
import { getConfig } from '../utils/get-deprecated-config';
import { DeprecatedConfig, isDeprecatedImportConfig } from '../utils/types';

export const name = 'no-deprecated-imports';

export const importNameWithCustomMessageId = 'importNameWithCustomMessage';
export const pathWithCustomMessageId = 'pathWithCustomMessage';

const rule = createRule<
  [{ deprecatedConfig: DeprecatedConfig }],
  string,
  TSESLint.RuleListener
>({
  name,
  defaultOptions: [{ deprecatedConfig: getConfig('imports') }],
  meta: {
    type: 'suggestion',

    docs: {
      description: 'Disallow importing deprecated modules.',
      recommended: 'error',
    },

    messages: {
      pathWithCustomMessage:
        "'{{importSource}}' import is restricted from being used. {{customMessage}}",
      importNameWithCustomMessage:
        "'{{importName}}' import from '{{importSource}}' is restricted. {{customMessage}}",
    },
    schema: [
      {
        type: 'object',
        properties: {
          deprecatedConfig: {
            type: 'object',
            properties: {
              '.+': {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  importSpecifiers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        importName: { type: 'string' },
                        message: { type: 'string' },
                      },
                      required: ['importName'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },

  create(context, [options]) {
    const { deprecatedConfig: defaultDeprecatedConfig } = options;

    const restrictedPathMessages =
      context.options[0]?.deprecatedConfig || defaultDeprecatedConfig;

    if (!isDeprecatedImportConfig(restrictedPathMessages)) {
      throw new Error('Config is invalid for deprecated imports');
    }

    /**
     * Report a restricted path.
     * @param {string} importSource path of the import
     * @param {node} node representing the restricted path reference
     * @param {Map<string,TSESTree.Node>} importNames Map of import names that are being imported
     * @returns {void}
     * @private
     */
    function checkRestrictedPathAndReport(
      importSource: string,
      node: TSESTree.Node,
      importNames: Map<string, TSESTree.Node>,
    ): void {
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
          messageId: pathWithCustomMessageId,
          data: {
            importSource,
            customMessage: config.message,
          } as any,
        });
      }

      // if there are specific named exports that are banned,
      // iterate through and check if they're being imported
      if ('importSpecifiers' in config) {
        config.importSpecifiers?.forEach((restrictedImport) => {
          if (importNames.has(restrictedImport.importName)) {
            context.report({
              node: importNames.get(restrictedImport.importName)!,
              messageId: importNameWithCustomMessageId,
              data: {
                importName: restrictedImport.importName,
                importSource: importSource,
                customMessage: restrictedImport.message,
              },
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
    const checkNode = <ImportExportNode extends TSESTree.Node>(
      node: ImportExportNode,
    ): void => {
      const importSource = (node as any).source.value.trim();
      const importNames = new Map<string, TSESTree.Node>();

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
            importNames.set(name, specifier as TSESTree.Node);
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
});

export default rule;
