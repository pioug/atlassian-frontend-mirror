// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const FUNCTION_NAME = 'useSyncExternalStore';

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: `Enforce that ${FUNCTION_NAME} is called with a third argument (getServerSnapshot) for SSR compatibility`,
			recommended: true,
		},
		messages: {
			missingServerSnapshot:
				"Pass getServerSnapshot as useSyncExternalStore's third argument. It must return the same initial snapshot during SSR and client hydration; a stable fallback is valid only if the component handles it and its type matches the snapshot. Returning null does not opt the component out of SSR. See https://react.dev/reference/react/useSyncExternalStore.",
		},
	},
	create(context) {
		return {
			CallExpression(node) {
				const { callee, arguments: args } = node;

				const isDirectCall = callee.type === 'Identifier' && callee.name === FUNCTION_NAME;
				const isMemberCall =
					callee.type === 'MemberExpression' &&
					callee.property.type === 'Identifier' &&
					callee.property.name === FUNCTION_NAME;

				if (!isDirectCall && !isMemberCall) {
					return;
				}

				if (args.length < 3) {
					context.report({
						node,
						messageId: 'missingServerSnapshot',
					});
				}
			},
		};
	},
};

export default rule;
