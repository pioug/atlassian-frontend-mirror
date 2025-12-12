import { adfNodeGroup } from '@atlaskit/adf-schema-generator';

import { blockCard } from '../nodes/blockCard';
import { blockquote } from '../nodes/blockquote';
import { codeBlock } from '../nodes/codeBlock';
import { decisionList } from '../nodes/decisionList';
import { embedCard } from '../nodes/embedCard';
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

// Not an actual group, but a collection of nodes that can't be nested inside each other
// TODO: ED-29537 - make it an actual group
export const nonNestableBlockContent = [
	paragraph.use('with_no_marks'),
	panel,
	blockquote,
	orderedList,
	bulletList,
	rule,
	heading.use('with_no_marks'),
	codeBlock,
	mediaGroup,
	mediaSingle.use('caption'),
	mediaSingle.use('full'),
	decisionList,
	taskList,
	table,
	// @ts-expect-error - types don't deal well with circular references for the variant
	table.use('with_nested_table'),
	blockCard,
	embedCard,
	extension.use('with_marks'),
	unsupportedBlock,
];

/**
 * @DSLCompatibilityException
 *
 * Pseudo group used to match existing validator and json schema specs.
 */
export const nonNestableBlockContentGroup = adfNodeGroup(
	'non_nestable_block_content',
	nonNestableBlockContent,
);
