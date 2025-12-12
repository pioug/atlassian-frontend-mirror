import { $onePlus, $or } from '@atlaskit/adf-schema-generator';
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
import { nestedExpand } from '../nodes/nestedExpand';
import { panel } from '../nodes/panel';
import { paragraph } from '../nodes/paragraph';
import { rule } from '../nodes/rule';
import { taskList } from '../nodes/task';
import { unsupportedBlock } from '../nodes/unsupportedBlock';

export const tableCellContentNodes = [
	paragraph.use('with_no_marks'),
	paragraph.use('with_alignment'),
	panel,
	blockquote,
	orderedList,
	bulletList,
	rule,
	heading.use('with_no_marks'),
	heading.use('with_alignment'),
	heading.use('with_indentation'),
	codeBlock,
	mediaSingle.use('caption'),
	mediaSingle.use('full'),
	mediaGroup,
	decisionList,
	taskList,
	blockCard,
	embedCard,
	extension.use('with_marks'),
	nestedExpand.use('content'),
	nestedExpand.use('with_no_marks'),
];

// This is not an actual group, but a collection of nodes
// @DSLCompatibilityException JSON Schema and PM Spec are not in sync. We need to fix it
// In PM Spec, they contain different items. (tableHeader using tableHeaderContentPseudoGroup, tableCell using tableCellContentPseudoGroup)
// In JSON Schema, both tableHeader and tableCell points to tableCellContentPseudoGroup
// The differences are highlighted below.
export const tableCellContentPseudoGroup = $onePlus(
	$or(...tableCellContentNodes, unsupportedBlock),
);

export const tableHeaderContentPseudoGroup = $onePlus(
	$or(...tableCellContentNodes, nestedExpand),
);
