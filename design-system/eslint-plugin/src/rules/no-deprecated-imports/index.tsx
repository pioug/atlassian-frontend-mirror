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

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { createChecks } from './checks';

export const name = 'no-deprecated-imports';

const rule = createLintRule({
	meta: {
		name,
		fixable: 'code',
		hasSuggestions: true,
		type: 'suggestion',

		docs: {
			description: 'Disallow importing deprecated modules.',
			recommended: true,
			severity: 'error',
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
					turnOffAutoFixer: {
						type: 'boolean',
					},
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
				additionalProperties: false,
			},
		],
	},

	create(context) {
		const { checkImportNode, checkExportNode, checkJSXElement, checkIdentifier, throwErrors } =
			createChecks(context);

		return errorBoundary({
			ImportDeclaration: checkImportNode,
			ExportNamedDeclaration: checkExportNode,
			JSXElement: checkJSXElement,
			Identifier: checkIdentifier,
			'Program:exit': throwErrors,
		});
	},
});

export default rule;
