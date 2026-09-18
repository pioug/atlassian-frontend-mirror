import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';

import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

const ruleAttributes = {
	localId: { type: 'string' as const, default: null, optional: true },
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

export const rule: ADFNode<
	[string, 'with_attrs', 'root_only', 'with_attrs_root_only'],
	ADFCommonNodeSpec
> = adfNode('rule')
	.define({
		attrs: { localId: { type: 'string', default: null, optional: true } },
	})
	.variant('with_attrs', {
		stage0: true,
		attrs: ruleAttributes,
	})
	// this variant is used to support breakout resizing for rule nodes at the document root
	.variant('root_only', {
		stage0: true,
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
	})
	.variant('with_attrs_root_only', {
		stage0: true,
		attrs: ruleAttributes,
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
	});
