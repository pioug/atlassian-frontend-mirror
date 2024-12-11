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
			url: 'https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/platform/eslint-plugin/src/rules/no-alias/README.md',
			description:
				'Disallow aliasing of feature flag utils to ensure feature flag usage is statically analyzable',
		},
		messages: {
			noSpecifierAlias:
				'Do not alias feature flag utils. Feature flag usage should be statically analyzable',
			noNamespaceSpecifier:
				'Destructure feature flag utils from import. Feature flag usage should be statically analyzable',
			noReassignment:
				'Do not reassign feature flag utils. Feature flag usage should be statically analyzable',
		},
	},
	create(context) {
		return {
			ImportDeclaration: (node) => {
				if (typeof node.source.value === 'string' && !IMPORT_SOURCES.has(node.source.value)) {
					return;
				}

				node.specifiers?.forEach((specifier) => {
					if (specifier.type === 'ImportSpecifier') {
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
