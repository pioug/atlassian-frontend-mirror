// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

import { getObjectPropertyAsLiteral, getObjectPropertyAsObject } from '../util/handle-ast-object';

type RuleOptions = {
	// exceptions to this rule, will be ignored
	exceptions?: string[];
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'This rule ensures that the package.json for your packages are set up correctly for publishing depending on the package name prefix',
			recommended: true,
		},
		hasSuggestions: false,
		schema: [
			{
				type: 'object',
				properties: {
					exceptions: {
						type: 'array',
						items: [{ type: 'string' }],
					},
				},
			},
		],
		messages: {
			publishConfigRequired:
				'Package {{packageName}} uses the public @atlaskit namespace. Add the intended npm publishConfig, following https://go.atlassian.com/package-namespace; verify the package is meant to be public before changing publication settings.',
			noPrivate:
				'Package {{packageName}} uses the public @atlaskit namespace but is private. If it is intended for npm publication, remove private: true and configure publishing; if it must remain internal, keep it private and use the appropriate internal namespace. See https://go.atlassian.com/package-namespace.',
		},
	},
	create(context) {
		const { exceptions } = (context.options?.[0] as RuleOptions) ?? {};

		return {
			ObjectExpression: (node: Rule.Node) => {
				if (
					// @ts-ignore - Jira's ESLint v10 types expose filename, platform still checks with ESLint v9.
					!(context.filename ?? context.getFilename()).endsWith('package.json') ||
					node.type !== 'ObjectExpression'
				) {
					return;
				}

				const packageName = getObjectPropertyAsLiteral(node, 'name');
				const packagePrivate = getObjectPropertyAsLiteral(node, 'private');
				const packagePublishConfig = getObjectPropertyAsObject(node, 'publishConfig');

				// exit if package is on known exception list
				if (exceptions && exceptions.findIndex((name) => name === packageName) !== -1) {
					return;
				}

				if (typeof packageName === 'string' && packageName.startsWith('@atlaskit')) {
					if (typeof packagePrivate === 'boolean' && packagePrivate) {
						return context.report({
							node,
							messageId: 'noPrivate',
							data: {
								packageName,
							},
						});
					}

					if (packagePublishConfig === null) {
						return context.report({
							node,
							messageId: 'publishConfigRequired',
							data: {
								packageName,
							},
						});
					}
				}
			},
		};
	},
};

export default rule;
