import type { ADFCommonNodeSpec, ADFNode} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { dataConsumer } from '../marks/dataConsumer';
import { fragment } from '../marks/fragment';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { blockCard } from './blockCard';
import { blockquote } from './blockquote';
import { bodiedExtension } from './bodiedExtension';
import { codeBlock } from './codeBlock';
import { decisionList } from './decisionList';
import { embedCard } from './embedCard';
import { extension } from './extension';
import { heading } from './heading';
import { bulletList, orderedList } from './list';
import { mediaGroup } from './mediaGroup';
import { mediaSingle } from './mediaSingle';
import { panel } from './panel';
import { paragraph } from './paragraph';
import { rule } from './rule';
import { table } from './tableNodes';
import { taskList } from './task';
import { unsupportedBlock } from './unsupportedBlock';

export const extensionFrame: ADFNode<[string], ADFCommonNodeSpec> = adfNode('extensionFrame').define({
	stage0: true,

	isolating: true,
	definingAsContext: false,
	definingForContent: true,
	selectable: false,

	// Marks don't make it into the PM node spec, as they get overridden by the marks in
	// packages/adf-schema-generator/src/transforms/adfToPm/buildPmSpec.ts
	marks: [dataConsumer, fragment, unsupportedMark, unsupportedNodeAttribute],

	attrs: {},

	content: [
		$onePlus(
			$or(
				paragraph.use('with_no_marks'),
				panel,
				blockquote,
				orderedList,
				bulletList,
				rule,
				heading.use('with_no_marks'),
				codeBlock,
				mediaGroup,
				mediaSingle.use('full'),
				mediaSingle.use('caption'),
				decisionList,
				taskList,
				table,
				// @ts-expect-error - types don't deal well with circular references for the variant
				table.use('with_nested_table'),
				extension.use('with_marks'),
				bodiedExtension.use('with_marks'),
				unsupportedBlock,
				blockCard,
				embedCard,
			),
		),
	],

	DANGEROUS_MANUAL_OVERRIDE: {
		'validator-spec': {
			'props.content.allowUnsupportedBlock': {
				remove: true,
				reason: '@DSLCompatibilityException - mismatch for extensionFrame',
			},
		},
	},
});
