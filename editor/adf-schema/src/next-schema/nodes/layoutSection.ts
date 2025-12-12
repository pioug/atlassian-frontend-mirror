import { $or, $range, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { layoutColumn } from './layoutColumn';
import { unsupportedBlock } from './unsupportedBlock';

export const layoutSection = adfNode('layoutSection')
	.define({
		isolating: true,
		attrs: {
			localId: { type: 'string', default: null, optional: true },
		},

		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],

		content: [$range(1, 3, $or(layoutColumn, unsupportedBlock)), $zeroPlus($or(unsupportedBlock))],
	})
	.variant('with_single_column', {
		stage0: true,
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		content: [$range(1, 5, $or(layoutColumn, unsupportedBlock)), $zeroPlus($or(unsupportedBlock))],
		attrs: {
			columnRuleStyle: {
				type: 'enum',
				values: ['solid'],
				default: null,
				optional: true,
			},
			localId: { type: 'string', default: null, optional: true },
		},
	})
	.variant('full', {
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		content: [$range(2, 3, $or(layoutColumn, unsupportedBlock))],
	});
