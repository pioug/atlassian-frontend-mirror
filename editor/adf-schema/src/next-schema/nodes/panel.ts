import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { breakout } from '../marks/breakout';
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
	paragraph.use('with_font_size'),
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

export const panel: ADFNode<[string, 'c1', 'root_only', 'c1_root_only'], ADFCommonNodeSpec> =
	adfNode('panel')
		.define({
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
		})
		.variant('c1', {
			// panel_c1 allows all standard panel content plus table (wired via addContent
			// in full-schema.adf.ts to avoid a circular module import).
			content: [$onePlus($or(...panelContent, extension.use('with_marks')))],
			ignore: ['json-schema', 'validator-spec'],
			preserveVariantNameInPm: true,
		})
		// this variant is used to support breakout resizing for panel nodes at the document root
		.variant('root_only', {
			stage0: true,
			marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		})
		// this variant is used to support breakout resizing for panel_c1 nodes at the document root
		.variant('c1_root_only', {
			stage0: true,
			marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
			// panel_c1 allows all standard panel content plus table (wired via addContent
			// in full-schema.adf.ts to avoid a circular module import).
			content: [$onePlus($or(...panelContent, extension.use('with_marks')))],
			ignore: ['json-schema', 'validator-spec'],
			preserveVariantNameInPm: true,
		});
