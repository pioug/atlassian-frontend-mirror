import { createLintRule } from '../utils/create-rule';

const primitiveDocsUrl = 'https://go.atlassian.com/dst-prefer-primitives';

const rule = createLintRule({
	meta: {
		name: 'prefer-primitives',
		type: 'suggestion',
		hasSuggestions: false,
		deprecated: true,
		replacedBy: ['@atlaskit/design-system/use-primitives'],
		docs: {
			description:
				'Increase awareness of primitive components via code hints. Strictly used for education purposes and discoverability. To enforce usage please refer to the `use-primitives` rule.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			preferPrimitives: `This "{{element}}" may be able to be replaced with a primitive component. See ${primitiveDocsUrl} for guidance.`,
		},
	},
	create() {
		/**
		 * We can't just outright delete the ESLint rule, since:
		 * ```
		 * // eslint-disable @eslint-plugin/design-system/prefer-primitives
		 * ```
		 * will cause CI to fail if the rule definition doesn't exist. So, instead
		 * we can change the implementation of the rule so that it never reports.
		 */
		return {};
	},
});

export default rule;
