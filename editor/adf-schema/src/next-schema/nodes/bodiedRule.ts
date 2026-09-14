import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $or, $range, adfNode } from '@atlaskit/adf-schema-generator';
import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { heading } from './heading';
import { paragraph } from './paragraph';

const bodiedRuleAttributes = {
	localId: { type: 'string' as const, default: '', minLength: 1 },
	alignment: {
		type: 'enum' as const,
		values: ['start', 'center', 'end'],
		default: null,
		optional: true,
	},
	color: {
		type: 'string' as const,
		default: null,
		optional: true,
		pattern: '^#[0-9a-fA-F]{6}$',
	},
	style: {
		type: 'enum' as const,
		values: ['solid', 'dashed', 'dotted', 'sketch', 'fade'],
		default: null,
		optional: true,
	},
	weight: {
		type: 'number' as const,
		default: null,
		minimum: 1,
		maximum: 3,
		optional: true,
	},
};

export const bodiedRule: ADFNode<[string, 'root_only'], ADFCommonNodeSpec> = adfNode('bodiedRule')
	.define({
		stage0: true,
		attrs: bodiedRuleAttributes,
		content: [$range(1, 1, $or(paragraph.use('with_no_marks'), heading.use('with_no_marks')))],
		marks: [unsupportedMark, unsupportedNodeAttribute],
	})
	// this variant is used to support breakout resizing for bodiedRule nodes at the document root
	.variant('root_only', {
		stage0: true,
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		noExtend: true,
	});
