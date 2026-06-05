import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

export const getNestingRulesFromSchema = (): Record<string, string[]> => {
	const KEYWORDS = [
		'inline',
		'block',
		'text',
		'leaf',
		'group',
		'unsupportedBlock',
		'unsupportedInline',
	];
	const rules: Record<string, string[]> = {};

	for (const nodeType of Object.keys(defaultSchema.nodes)) {
		const contentStr = defaultSchema.nodes[nodeType]?.spec.content;
		if (!contentStr) {
			continue;
		}

		const allowedChildren = // eslint-disable-next-line require-unicode-regexp
			(String(contentStr).match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g) || []).filter(
				(match, index, arr) =>
					!KEYWORDS.includes(match) && defaultSchema.nodes[match] && arr.indexOf(match) === index,
			);

		if (allowedChildren.length > 0) {
			rules[nodeType] = allowedChildren;
		}
	}

	return rules;
};
