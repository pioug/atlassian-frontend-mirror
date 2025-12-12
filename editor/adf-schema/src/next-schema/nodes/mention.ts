import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const mention = adfNode('mention').define({
	inline: true,
	selectable: true,

	marks: [unsupportedNodeAttribute, unsupportedMark],

	attrs: {
		id: { type: 'string', default: '' },
		localId: { type: 'string', optional: true, default: null },
		text: { type: 'string', default: '', optional: true },
		accessLevel: { type: 'string', default: '', optional: true },
		userType: {
			type: 'enum',
			values: ['DEFAULT', 'SPECIAL', 'APP'],
			default: null,
			optional: true,
		},
	},

	stage0: {
		marks: [unsupportedNodeAttribute, unsupportedMark, annotation],
	},
});
