import type { HeadingDefinition } from '@atlaskit/adf-schema/heading';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';
import type { BodiedRuleAttributes, BodiedRuleDefinition } from '@atlaskit/adf-schema/bodied-rule';

export const bodiedRule = (
	attrs: BodiedRuleAttributes,
	...content: [content: HeadingDefinition | ParagraphDefinition]
): BodiedRuleDefinition => ({
	type: 'bodiedRule',
	attrs,
	content,
});
