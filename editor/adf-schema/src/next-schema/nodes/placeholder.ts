import { adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const placeholder = adfNode('placeholder').define({
	selectable: false,
	inline: true,

	marks: [unsupportedMark, unsupportedNodeAttribute],
	allowNoChildMark: true,

	attrs: {
		text: { type: 'string', default: '' },
		localId: { type: 'string', default: null, optional: true },
	},
});
