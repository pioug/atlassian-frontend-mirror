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
			missingServerSnapshot: `'${FUNCTION_NAME}' must be called with a third argument (getServerSnapshot). Without it, React will throw during server-side rendering.

If your component relies on browser-only APIs (e.g. localStorage, WebRTC, WebGL) and must not render on the server, pass \`() => null\` (or another stable fallback) as the third argument — this is the correct way to opt out of SSR, not an omission.

Prefer higher-level APIs that wrap ${FUNCTION_NAME} where available, as they handle SSR concerns for you.

See the React docs for usage guidance: https://react.dev/reference/react/useSyncExternalStore`,
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
