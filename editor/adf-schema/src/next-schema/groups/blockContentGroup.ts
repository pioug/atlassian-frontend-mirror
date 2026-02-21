import { adfNodeGroup, type ADFNodeGroup } from '@atlaskit/adf-schema-generator';
import { blockCard } from '../nodes/blockCard';
import { blockquote } from '../nodes/blockquote';
import { bodiedExtension } from '../nodes/bodiedExtension';
import { codeBlock } from '../nodes/codeBlock';
import { confluenceUnsupportedBlock } from '../nodes/confluenceUnsupportedBlock';
import { decisionList } from '../nodes/decisionList';
import { embedCard } from '../nodes/embedCard';
import { expand } from '../nodes/expand';
import { extension } from '../nodes/extension';
import { heading } from '../nodes/heading';
import { bulletList, orderedList } from '../nodes/list';
import { mediaGroup } from '../nodes/mediaGroup';
import { mediaSingle } from '../nodes/mediaSingle';
import { panel } from '../nodes/panel';
import { paragraph } from '../nodes/paragraph';
import { rule } from '../nodes/rule';
import { table } from '../nodes/tableNodes';
import { taskList } from '../nodes/task';
import { unsupportedBlock } from '../nodes/unsupportedBlock';

/**
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @DSLCompatibilityException
 *
 * Pseudo group used to match existing validator and json schema specs.
 *
 * Has slight differences from the original blockGroup:
 * - no base paragraph
 * - no base extension
 * - no base mediaSingle
 * - no base heading
 */
export const blockContentGroup: ADFNodeGroup = adfNodeGroup(
	'block_content',
	[
		blockCard,
		paragraph.use('with_no_marks'),
		paragraph.use('with_alignment'),
		paragraph.use('with_indentation'),
		mediaSingle.use('caption'),
		mediaSingle.use('full'),
		codeBlock,
		taskList,
		bulletList,
		orderedList,
		heading.use('with_no_marks'),
		heading.use('with_alignment'),
		heading.use('with_indentation'),
		mediaGroup,
		decisionList,
		rule,
		panel,
		blockquote,
		extension.use('with_marks'),
		embedCard,
		table,
		// @ts-expect-error - types don't deal well with circular references for the variant
		table.use('with_nested_table'),
		expand,
		bodiedExtension.use('with_marks'),
		confluenceUnsupportedBlock,
		unsupportedBlock,
	],
	{
		ignore: ['pm-spec'],
	},
);
