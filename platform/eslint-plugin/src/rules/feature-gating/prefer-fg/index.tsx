import type { Rule } from 'eslint';

import { FEATURE_API_IMPORT_SOURCES } from '../../constants';
import type { Node } from '../utils';
import type { Program } from 'estree';
import { getScope } from '../../util/context-compat';

const validateUsage = (
	node: Node<'CallExpression'>,
	utilName: string,
	context: Rule.RuleContext,
	changeMap: Map<any, any>,
) => {
	const resolved = getScope(context, node).references.find(
		(ref) => ref.identifier.name === utilName,
	)?.resolved;

	const importSpecifierDefinition = resolved?.defs.find(
		(def: any) =>
			def.node?.type === 'ImportSpecifier' &&
			FEATURE_API_IMPORT_SOURCES.has(def.parent?.source.value),
	);

	if (importSpecifierDefinition) {
		const [flagNameArg] = node.arguments;

		context.report({
			messageId: 'preferFG',
			node,
			*fix(fixer) {
				yield fixer.replaceText(node, `fg(${context.sourceCode.getText(flagNameArg)})`);

				const importDeclaration = importSpecifierDefinition.parent;

				if (changeMap.has(importDeclaration)) {
					const changeCounts = changeMap.get(importDeclaration);

					changeMap.set(importDeclaration, {
						...changeCounts,
						[utilName]: changeCounts[utilName] + 1 || 1,
					});
				} else {
					changeMap.set(importDeclaration, { [utilName]: 1 });
				}
			},
		});
	}
};

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			url: 'https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/platform/eslint-plugin/src/rules/prefer-fg/README.md',
			description: 'Keep usages of boolean feature flags consistent',
		},
		fixable: 'code',
		messages: {
			preferFG: 'Use `fg` instead for boolean feature flags',
			autoFixImports: 'Use `fg` instead for boolean feature flags',
		},
	},
	create(context) {
		let changeMap: Map<any, any>;

		return {
			'CallExpression[callee.name="getBooleanFF"]': (node: Node<any>) => {
				if (node.type !== 'CallExpression') {
					return;
				}

				changeMap = changeMap || new Map();
				validateUsage(node, 'getBooleanFF', context, changeMap);
			},
			'Program:exit': (node: Program) => {
				if (changeMap?.size) {
					changeMap.forEach((changeCounts, importDeclaration) => {
						const [moduleScope] = getScope(context, node).childScopes;
						const importSpecifiers = new Set(
							importDeclaration.specifiers.map(({ imported }: any) => imported.name),
						);

						importSpecifiers.add('fg');

						Object.keys(changeCounts).forEach((utilName) => {
							if (changeCounts[utilName] === moduleScope.set.get(utilName)?.references.length) {
								importSpecifiers.delete(utilName);
							}
						});

						context.report({
							messageId: 'autoFixImports',
							node: importDeclaration,
							fix: (fixer) =>
								fixer.replaceText(
									importDeclaration,
									`import { ${Array.from(importSpecifiers).join(', ')} } from '${
										importDeclaration.source.value
									}';`,
								),
						});
					});

					changeMap.clear();
				}
			},
		};
	},
};

export default rule;
