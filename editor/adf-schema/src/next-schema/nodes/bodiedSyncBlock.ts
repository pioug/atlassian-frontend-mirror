import type { ADFCommonNodeSpec, ADFNode} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { unsupportedBlock } from '../nodes/unsupportedBlock';
import { blockCard } from './blockCard';
import { blockquote } from './blockquote';
import { codeBlock } from './codeBlock';
import { confluenceUnsupportedBlock } from './confluenceUnsupportedBlock';
import { decisionList } from './decisionList';
import { embedCard } from './embedCard';
import { expand } from './expand';
import { bulletList, orderedList } from './list';
import { mediaGroup } from './mediaGroup';
import { mediaSingle } from './mediaSingle';
import { panel } from './panel';
import { paragraph } from './paragraph';
import { rule } from './rule';

import { heading } from './heading';
import { table } from './tableNodes';
import { taskList } from './task';
import { layoutSection } from './layoutSection';

export const bodiedSyncBlock: ADFNode<[string], ADFCommonNodeSpec> = adfNode('bodiedSyncBlock').define({
	selectable: true,
	isolating: true,
	marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
	attrs: {
		resourceId: { type: 'string', default: '' },
		localId: { type: 'string', default: '' },
	},
	content: [
		$onePlus(
			$or(
				paragraph,
				paragraph.use('with_alignment'),
				paragraph.use('with_indentation'),
				paragraph.use('with_no_marks'),
				blockCard,
				blockquote,
				blockquote.use('legacy'),
				bulletList,
				codeBlock,
				confluenceUnsupportedBlock,
				decisionList,
				embedCard,
				expand,
				heading,
				heading.use('with_alignment'),
				heading.use('with_indentation'),
				heading.use('with_no_marks'),
				layoutSection,
				layoutSection.use('with_single_column'),
				layoutSection.use('full'),
				mediaGroup,
				mediaSingle,
				mediaSingle.use('caption'),
				mediaSingle.use('full'),
				mediaSingle.use('width_type'),
				orderedList,
				panel,
				rule,
				table,
				// @ts-expect-error - types don't deal well with circular references for the variant
				table.use('with_nested_table'),
				taskList,
				unsupportedBlock,
			),
		),
	],
});
