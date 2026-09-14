import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';

const TODO_KEYWORD_REGEX = /^(?:@|!|#)?(TODO|todo|FIX\s?ME|fix\s?me|FIX|fix)\b/u;

type Options = [];

const TODO_FORMAT_REGEX = /^\s*TODO: [A-Z]+-\d+ - .+/u;

export const rule: TSESLint.RuleModule<'invalidTodoFormat'> = ESLintUtils.RuleCreator.withoutDocs<
	Options,
	'invalidTodoFormat'
>({
	defaultOptions: [],
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce TODO comment format',
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
		return {
			Program() {
				const sourceCode = context.getSourceCode();
				const comments = sourceCode.getAllComments();

				comments.forEach((comment) => {
					const beginsWithKeyword = TODO_KEYWORD_REGEX.test(comment.value.trim());

					if (comment.type === 'Line' && beginsWithKeyword) {
						if (!TODO_FORMAT_REGEX.test(comment.value)) {
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

const EnforceTodoCommentFormatRule: {
	rule: TSESLint.RuleModule<'invalidTodoFormat'>;
} = { rule };
export default EnforceTodoCommentFormatRule;
