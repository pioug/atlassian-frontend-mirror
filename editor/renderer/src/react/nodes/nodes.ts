/* eslint-disable @atlaskit/editor/no-re-export */

import type React from 'react';

import { UnsupportedBlock, UnsupportedInline } from '@atlaskit/editor-common/ui';

import Expand from '../../ui/Expand';
import BlockCard from './blockCard';
import Blockquote from './blockquote';
import BodiedExtension from './bodiedExtension';
import BodiedSyncBlock from './bodiedSyncBlock';
import BulletList from './bulletList';
import Caption from './caption';
import CodeBlock from './codeBlock/codeBlock';
import WindowedCodeBlock from './codeBlock/windowedCodeBlock';
import DateNode from './date';
import DecisionItem from './decisionItem';
import DecisionList from './decisionList';
import Doc from './doc';
import EmbedCard from './embedCard';
import Emoji from './emoji';
import Extension from './extension';
import ExtensionFrame from './extensionFrame';
import HardBreak from './hardBreak';
import Heading from './heading';
import InlineCard from './inlineCard';
import InlineExtension from './inlineExtension';
import LayoutColumn from './layoutColumn';
import LayoutSection from './layoutSection';
import ListItem from './listItem';
import Media from './media';
import MediaGroup from './mediaGroup';
import MediaInline from './mediaInline';
import MediaSingle from './mediaSingle';
import Mention from './mention';
import MultiBodiedExtension from './multiBodiedExtension';
import OrderedList from './orderedList';
import Panel from './panel';
import Paragraph from './paragraph';
import Placeholder from './placeholder';
import Rule from './rule';
import Status from './status';
import SyncBlock from './syncBlock';
import Table from './table';
import { TableCell, TableHeader } from './tableCell';
import TableRow from './tableRow';
import TaskItem from './taskItem';
import TaskList from './taskList';
import UnknownBlock from './unknownBlock';

export type NodeNames =
	| 'blockCard'
	| 'blockquote'
	| 'blockTaskItem'
	| 'bodiedExtension'
	| 'bodiedSyncBlock'
	| 'bulletList'
	| 'caption'
	| 'codeBlock'
	| 'date'
	| 'decisionItem'
	| 'decisionList'
	| 'doc'
	| 'embedCard'
	| 'emoji'
	| 'expand'
	| 'extension'
	| 'extensionFrame'
	| 'hardBreak'
	| 'heading'
	| 'inlineCard'
	| 'inlineExtension'
	| 'layoutColumn'
	| 'layoutSection'
	| 'listItem'
	| 'media'
	| 'mediaGroup'
	| 'mediaInline'
	| 'mediaSingle'
	| 'mention'
	| 'multiBodiedExtension'
	| 'nestedExpand'
	| 'orderedList'
	| 'panel'
	| 'panel_c1'
	| 'paragraph'
	| 'placeholder'
	| 'rule'
	| 'status'
	| 'syncBlock'
	| 'table'
	| 'tableCell'
	| 'tableHeader'
	| 'tableRow'
	| 'taskItem'
	| 'taskList'
	| 'unknownBlock'
	| 'unsupportedBlock'
	| 'unsupportedInline'
	| 'windowedCodeBlock';

type Nodes = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key in NodeNames]: React.ComponentType<React.PropsWithChildren<any>>;
};

export const nodes: Nodes = {
	blockCard: BlockCard,
	blockquote: Blockquote,
	blockTaskItem: TaskItem,
	bodiedExtension: BodiedExtension,
	bodiedSyncBlock: BodiedSyncBlock,
	bulletList: BulletList,
	caption: Caption,
	codeBlock: CodeBlock,
	date: DateNode,
	decisionItem: DecisionItem,
	decisionList: DecisionList,
	doc: Doc,
	embedCard: EmbedCard,
	emoji: Emoji,
	expand: Expand,
	extension: Extension,
	extensionFrame: ExtensionFrame,
	hardBreak: HardBreak,
	heading: Heading,
	inlineCard: InlineCard,
	inlineExtension: InlineExtension,
	layoutColumn: LayoutColumn,
	layoutSection: LayoutSection,
	listItem: ListItem,
	media: Media,
	mediaGroup: MediaGroup,
	mediaInline: MediaInline,
	mediaSingle: MediaSingle,
	mention: Mention,
	multiBodiedExtension: MultiBodiedExtension,
	nestedExpand: Expand,
	orderedList: OrderedList,
	panel: Panel,
	panel_c1: Panel,
	paragraph: Paragraph,
	placeholder: Placeholder,
	rule: Rule,
	status: Status,
	syncBlock: SyncBlock,
	table: Table,
	tableCell: TableCell,
	tableHeader: TableHeader,
	tableRow: TableRow,
	taskItem: TaskItem,
	taskList: TaskList,
	unknownBlock: UnknownBlock,
	unsupportedBlock: UnsupportedBlock,
	unsupportedInline: UnsupportedInline,
	windowedCodeBlock: WindowedCodeBlock,
} as const;
