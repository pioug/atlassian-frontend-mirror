// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'This rule disallows a dependency to be defined in both dependencies and devDependencies',
			recommended: false,
		},
		fixable: 'code',
		messages: {
			unexpectedDuplicateDependency:
				'{{name}} appears in both dependencies and devDependencies. Keep the runtime dependency and remove its duplicate devDependencies entry; the autofix performs this removal.',
		},
	},
	create(context) {
		const dependencies = new Map();
		const devDependencies = new Map();

		return {
			'ObjectExpression Property[key.value=dependencies] Property': (node: Rule.Node) => {
				// @ts-expect-error
				dependencies.set(node.key.value, node.key);
			},
			'ObjectExpression Property[key.value=devDependencies] Property': (node: Rule.Node) => {
				// @ts-expect-error
				devDependencies.set(node.key.value, node.key);
			},
			'Program:exit': () => {
				for (const [dependency, node] of devDependencies) {
					if (dependencies.has(dependency)) {
						context.report({
							data: {
								name: dependency,
							},
							fix(fixer) {
								// @ts-ignore - Jira's ESLint v10 types expose sourceCode, platform still checks with ESLint v9.
								const sourceCode = context.sourceCode ?? context.getSourceCode();
								const property = node.parent;
								const nextToken = sourceCode.getTokenAfter(property);
								const previousToken = sourceCode.getTokenBefore(property);
								let [start, end] = property.range;

								if (nextToken?.value === ',') {
									end = nextToken.range[1];
									const lineStart = sourceCode.text.lastIndexOf('\n', start - 1) + 1;
									const lineEnd = sourceCode.text.indexOf('\n', end);
									if (
										lineEnd !== -1 &&
										sourceCode.text.slice(lineStart, start).trim() === '' &&
										sourceCode.text.slice(end, lineEnd).trim() === ''
									) {
										start = lineStart;
										end = lineEnd + 1;
									}
								} else if (previousToken?.value === ',') {
									start = previousToken.range[0];
								}

								return fixer.removeRange([start, end]);
							},
							messageId: 'unexpectedDuplicateDependency',
							node,
						});
					}
				}
			},
		};
	},
};

export default rule;
