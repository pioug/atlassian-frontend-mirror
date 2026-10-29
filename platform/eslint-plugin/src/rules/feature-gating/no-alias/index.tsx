import type { Rule } from 'eslint';

import {
	FEATURE_API_IMPORT_SOURCES,
	FEATURE_MOCKS_IMPORT_SOURCES,
	FEATURE_UTILS_IMPORT_SOURCES,
} from '../../constants';
import { isIdentifierImportedFrom, type Node } from '../utils';

const IMPORT_SOURCES = new Set([
	...FEATURE_API_IMPORT_SOURCES,
	...FEATURE_MOCKS_IMPORT_SOURCES,
	...FEATURE_UTILS_IMPORT_SOURCES,
]);

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/feature-gating/no-alias/README.md',
			description:
				'Disallow aliasing of feature flag utils to ensure feature flag usage is statically analyzable',
		},
		messages: {
			noSpecifierAlias:
				'Remove the as alias from this feature-flag import and update its call sites to the original exported name, so static flag analysis can recognize it.',
			noNamespaceSpecifier:
				'Replace this namespace import with named feature-flag imports, for example import { fg } from the same supported module, and update namespace member calls to those names.',
			noReassignment:
				'Remove this extra variable alias and call the originally imported feature-flag utility directly at its use sites, preserving the static flag name.',
		},
	},
	create(context) {
		return {
			ImportDeclaration: (node) => {
				if (typeof node.source.value === 'string' && !IMPORT_SOURCES.has(node.source.value)) {
					return;
				}

				node.specifiers?.forEach((specifier) => {
					if (specifier.type === 'ImportSpecifier' && 'name' in specifier.imported) {
						const { imported, local } = specifier;

						if (imported.name !== local.name) {
							context.report({
								messageId: 'noSpecifierAlias',
								node: specifier,
							});
						}
					} else if (specifier.type === 'ImportNamespaceSpecifier') {
						context.report({
							messageId: 'noNamespaceSpecifier',
							node: specifier,
						});
					}
				});
			},
			'VariableDeclaration[kind="const"] > VariableDeclarator[id.type="Identifier"][init.type="Identifier"]':
				(node: Node<'VariableDeclarator'>) => {
					if (!node.init || node.init.type !== 'Identifier') {
						return;
					}

					const isReassignment = isIdentifierImportedFrom(
						node.init.name,
						IMPORT_SOURCES,
						context,
						node,
					);

					if (isReassignment) {
						context.report({
							messageId: 'noReassignment',
							node,
						});
					}
				},
		};
	},
};

export default rule;
