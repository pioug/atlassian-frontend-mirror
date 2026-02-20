import type { ADFCommonNodeSpec, ADFNode} from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const hardBreak: ADFNode<[string], ADFCommonNodeSpec> = adfNode('hardBreak').define({
	inline: true,
	selectable: false,
	linebreakReplacement: true,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		// Carried over from original JSON Schema as is
		text: { type: 'enum', values: ['\n'], default: '\n', optional: true },
		localId: { type: 'string', default: null, optional: true },
	},
});
