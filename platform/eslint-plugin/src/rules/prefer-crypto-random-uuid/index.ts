// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem', // Problem type = can be error
		docs: {
			description:
				'Prefer crypto.randomUUID() over uuid library. The uuid package causes Jest mocking issues.',
			recommended: true,
		},
		fixable: 'code', // Enables --fix
		messages: {
			preferCryptoRandomUUID:
				'Use crypto.randomUUID() instead of the uuid library. Run `eslint --fix` to auto-migrate.',
		},
	},
	create(context) {
		const uuidImports = new Map(); // Track imported names

		return {
			ImportDeclaration(node) {
				if (node.type !== 'ImportDeclaration') {
					return;
				}

				const source = node.source.value;
				if (typeof source === 'string' && (source === 'uuid' || /^uuid\/v[14]$/.test(source))) {
					// Track imported name (e.g., uuid, v4, etc.)
					const specifier = node.specifiers[0];
					if (specifier) {
						uuidImports.set(specifier.local.name, node);
					}

					context.report({
						node,
						messageId: 'preferCryptoRandomUUID',
						fix(fixer) {
							// Remove the import - usages will be fixed separately
							return fixer.remove(node);
						},
					});
				}
			},

			CallExpression(node) {
				if (node.type !== 'CallExpression') {
					return;
				}

				// Handle direct uuid() or v4() calls
				if (node.callee.type === 'Identifier') {
					const calleeName = node.callee.name;

					if (uuidImports.has(calleeName)) {
						context.report({
							node,
							messageId: 'preferCryptoRandomUUID',
							fix(fixer) {
								// Replace uuid() with crypto.randomUUID()
								return fixer.replaceText(node.callee, 'crypto.randomUUID');
							},
						});
					}
				}

				// Handle require('uuid')
				if (
					node.callee.type === 'Identifier' &&
					node.callee.name === 'require' &&
					node.arguments[0]?.type === 'Literal'
				) {
					const arg = node.arguments[0].value;
					if (typeof arg === 'string' && (arg === 'uuid' || /^uuid\/v[14]$/.test(arg))) {
						context.report({
							node,
							messageId: 'preferCryptoRandomUUID',
							// require() needs manual refactoring
						});
					}
				}
			},

			'Program:exit'() {
				uuidImports.clear();
			},
		};
	},
};

export default rule;
