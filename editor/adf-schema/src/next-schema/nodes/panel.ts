import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';

import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { blockCard } from './blockCard';
import { bodiedRule } from './bodiedRule';
import { codeBlock } from './codeBlock';
import { decisionList } from './decisionList';
import { extension } from './extension';
import { heading } from './heading';
import { bulletList, orderedList } from './list';
import { mediaGroup } from './mediaGroup';
import { mediaSingle } from './mediaSingle';
import { paragraph } from './paragraph';
import { rule } from './rule';
import { table } from './tableStub';
import { taskList } from './task';
import { unsupportedBlock } from './unsupportedBlock';

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
	rule.use('with_attrs'),
	bodiedRule,
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
			// panel_c1 allows all standard panel content plus table. `stage0: true` includes it in the
			// stage-0 JSON schema (not full) and the validator spec so table-in-panel validates.
			// `noExtend` emits it as a standalone JSON Schema definition because its content is a
			// superset of panel_node (adds table), which an allOf extension cannot express. Runtime
			// acceptance is gated in adf-utils behind the patch flag.
			stage0: true,
			noExtend: true,
			content: [$onePlus($or(...panelContent, extension.use('with_marks'), table))],
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
			noExtend: true,
			marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
			// panel_c1_root_only allows all standard panel content plus table (see c1 above).
			content: [$onePlus($or(...panelContent, extension.use('with_marks'), table))],
			preserveVariantNameInPm: true,
		});
