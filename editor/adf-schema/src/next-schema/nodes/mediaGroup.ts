import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { media } from './media';
import { unsupportedBlock } from './unsupportedBlock';

export const mediaGroup = adfNode('mediaGroup').define({
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	// Need to be empty object to match old PM Spec
	attrs: {},

	content: [$onePlus($or(media, unsupportedBlock))],
});
