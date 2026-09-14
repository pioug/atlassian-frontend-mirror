import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { blockContentGroup } from '../groups/blockContentGroup';
import { blockGroup } from '../groups/blockGroup';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { unsupportedBlock } from '../nodes/unsupportedBlock';
import { panel } from './panel';

const layoutColumnAttributes = {
	width: {
		type: 'number' as const,
		minimum: 0,
		maximum: 100,
		default: undefined,
	},
	localId: { type: 'string' as const, default: null, optional: true },
	valign: {
		type: 'enum' as const,
		values: ['top', 'middle', 'bottom'],
		default: null,
		optional: true,
	},
};

export const layoutColumn: ADFNode<[string], ADFCommonNodeSpec> = adfNode('layoutColumn').define({
	isolating: true,
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: layoutColumnAttributes,
	// panel_c1 (table-in-panel) is also valid inside a layout column. It must come before
	// `blockContentGroup`, which contributes the bare `panel` name: the validator's repairing loop
	// takes the first valid candidate, and base `panel` "succeeds" by wrapping a nested table as
	// `unsupportedBlock`. Kept after `blockGroup` so `block` stays the leading PM alternative.
	// See the same note in full-schema.adf.ts.
	content: [$onePlus($or(blockGroup, panel.use('c1'), blockContentGroup, unsupportedBlock))],
});
