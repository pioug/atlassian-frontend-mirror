import { $onePlus } from '@atlaskit/adf-schema-generator/$onePlus';
import { $or } from '@atlaskit/adf-schema-generator/$or';
import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { media } from './media';
import { unsupportedBlock } from './unsupportedBlock';

export const mediaGroup: ADFNode<[string], ADFCommonNodeSpec> = adfNode('mediaGroup').define({
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	// Need to be empty object to match old PM Spec
	attrs: {},

	content: [$onePlus($or(media, unsupportedBlock))],
});
