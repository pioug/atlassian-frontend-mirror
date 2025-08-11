import { ESLintUtils } from '@typescript-eslint/utils';

type Options = [];

export const rule = ESLintUtils.RuleCreator.withoutDocs<Options, 'invalidTodoFormat'>({
	defaultOptions: [],
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce TODO comment format',
			recommended: 'error',
		},
		schema: [], // no options
		messages: {
			invalidTodoFormat: `
			TODO comments must have a valid ticket number attached and must be in the format '// TODO: <ticket-number> - <description>'
			Example: '// TODO: EDF-123 - Some description'
			`,
		},
	},
	create(context) {
		const todoFormat = /^\s*TODO: [A-Z]+-\d+ - .+/u;

		return {
			Program() {
				const sourceCode = context.getSourceCode();
				const comments = sourceCode.getAllComments();

				comments.forEach((comment) => {
					const beginsWithKeyword = /^(?:@|!|#)?(TODO|todo|FIX\s?ME|fix\s?me|FIX|fix)\b/u.test(
						comment.value.trim(),
					);

					if (comment.type === 'Line' && beginsWithKeyword) {
						if (!todoFormat.test(comment.value)) {
							context.report({
								node: comment,
								loc: comment.loc,
								messageId: 'invalidTodoFormat',
							});
						}
					}
				});
			},
		};
	},
});

// @ts-ignore - TS2742 TypeScript 5.9.2 upgrade
export default { rule };
