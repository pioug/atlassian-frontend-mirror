// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'This rule disallows public packages to have pre/post install scripts as installations can happen on different environments',
			recommended: false,
		},
		hasSuggestions: false,
		messages: {
			prePostInstallScriptsNotAllowed: 'pre/post install scripts not allowed in package.json',
		},
	},
	create(context) {
		return {
			'ObjectExpression Property[key.value=scripts] Property[key.value=/^(pre|post)install$/]': (
				node: Rule.Node,
			) => {
				if (!context.getFilename().endsWith('/package.json')) {
					return;
				}

				return context.report({
					node,
					messageId: 'prePostInstallScriptsNotAllowed',
				});
			},
		};
	},
};

export default rule;
