import { adfNodeGroup } from '@atlaskit/adf-schema-generator';
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

export const blockGroup = adfNodeGroup(
	'block',
	[
		blockCard,
		codeBlock,
		mediaSingle,
		mediaSingle.use('caption'),
		mediaSingle.use('full'),
		mediaSingle.use('width_type'),
		paragraph,
		paragraph.use('with_alignment'),
		paragraph.use('with_indentation'),
		paragraph.use('with_no_marks'),
		taskList,
		orderedList,
		bulletList,
		blockquote,
		blockquote.use('legacy'),
		decisionList,
		embedCard,
		extension,
		extension.use('with_marks'),
		heading,
		heading.use('with_indentation'),
		heading.use('with_no_marks'),
		heading.use('with_alignment'),
		mediaGroup,
		rule,
		panel,
		table,
		// @ts-expect-error - types don't deal well with circular references for the variant
		table.use('with_nested_table'),
		bodiedExtension,
		bodiedExtension.use('with_marks'),
		expand,
		confluenceUnsupportedBlock,
		unsupportedBlock,
	],
	{
		// @DSLCompatibilityException
		// Block group in PM doesn't match ADF
		ignore: ['validator-spec', 'json-schema'],
	},
);
