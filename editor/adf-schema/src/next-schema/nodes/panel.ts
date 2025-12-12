import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { blockCard } from './blockCard';
import { codeBlock } from './codeBlock';
import { decisionList } from './decisionList';
import { heading } from './heading';
import { bulletList, orderedList } from './list';
import { mediaGroup } from './mediaGroup';
import { mediaSingle } from './mediaSingle';
import { paragraph } from './paragraph';
import { rule } from './rule';
import { taskList } from './task';
import { unsupportedBlock } from './unsupportedBlock';
import { extension } from './extension';

const panelContent = [
	paragraph.use('with_no_marks'),
	heading.use('with_no_marks'),
	bulletList,
	orderedList,
	blockCard,
	mediaGroup,
	mediaSingle.use('caption'),
	mediaSingle.use('full'),
	codeBlock,
	taskList,
	rule,
	decisionList,
	unsupportedBlock,
];

export const panel = adfNode('panel').define({
	selectable: true,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		panelType: {
			type: 'enum',
			values: ['info', 'note', 'tip', 'warning', 'error', 'success', 'custom'],
			default: 'info',
		},
		panelIcon: { type: 'string', default: null, optional: true },
		panelIconId: { type: 'string', default: null, optional: true },
		panelIconText: { type: 'string', default: null, optional: true },
		panelColor: { type: 'string', default: null, optional: true },
		localId: { type: 'string', default: null, optional: true },
	},
	content: [$onePlus($or(...panelContent, extension.use('with_marks')))],
});
