/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json
import type { NodeSerializer } from './interfaces';
import blockCard from './nodes/block-card';
import blockquote from './nodes/blockquote';
import bodiedExtension from './nodes/bodiedExtension';
import bodiedSyncBlock from './nodes/bodiedSyncBlock';
import bulletList from './nodes/bullet-list';
import caption from './nodes/caption';
import codeBlock from './nodes/code-block';
import date from './nodes/date';
import decisionItem from './nodes/decision-item';
import decisionList from './nodes/decision-list';
import emoji from './nodes/emoji';
import expand from './nodes/expand';
import hardBreak from './nodes/hard-break';
import heading from './nodes/heading';
import inlineCard from './nodes/inline-card';
import inlineExtension from './nodes/inlineExtension';
import layoutColumn from './nodes/layoutColumn';
import layoutSection from './nodes/layoutSection';
import listItem from './nodes/list-item';
import media from './nodes/media';
import mediaGroup from './nodes/media-group';
import mediaInline from './nodes/media-inline';
import mediaSingle from './nodes/media-single';
import mention from './nodes/mention';
import orderedList from './nodes/ordered-list';
import panel from './nodes/panel';
import paragraph from './nodes/paragraph';
import rule from './nodes/rule';
import status from './nodes/status';
import table from './nodes/table';
import tableCell from './nodes/table-cell';
import tableHeader from './nodes/table-header';
import tableRow from './nodes/table-row';
import taskItem from './nodes/task-item';
import taskList from './nodes/task-list';
import text from './nodes/text';
import unknownBlock from './nodes/unknown-block';

const renderNothing = (): string => '';

export const nodeSerializers: { [key: string]: NodeSerializer } = {
	bodiedExtension: bodiedExtension,
	blockquote,
	blockCard,
	bulletList,
	caption,
	codeBlock,
	decisionList,
	decisionItem,
	emoji,
	extension: bodiedExtension, // Old node, treated as bodied ext. for backwards compatibility
	image: renderNothing,
	inlineCard,
	embedCard: inlineCard,
	layoutColumn,
	layoutSection,
	inlineExtension,
	hardBreak,
	heading,
	listItem,
	media,
	mediaGroup,
	mediaInline,
	mediaSingle,
	mention,
	orderedList,
	panel,
	paragraph,
	placeholder: renderNothing,
	rule,
	table,
	tableCell,
	tableHeader,
	tableRow,
	taskItem,
	blockTaskItem: taskItem,
	taskList,
	text,
	unknownBlock,
	status,
	date,
	expand,
	nestedExpand: expand,
	bodiedSyncBlock,
	syncBlock: bodiedExtension, // Treat reference sync blocks like extensions until we update to fetch content from BE
};
