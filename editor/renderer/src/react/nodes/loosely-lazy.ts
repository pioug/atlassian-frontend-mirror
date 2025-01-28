/* eslint-disable @atlaskit/editor/no-re-export */
// Mapping file
import type React from 'react';
import { lazyForPaint } from 'react-loosely-lazy';

import Table from './table';
import TableRow from './tableRow';

import type TaskListComponent from './taskList';
import type TaskItemComponent from './taskItem';
import type DecisionListComponent from './decisionList';
import type DecisionItemComponent from './decisionItem';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import type DateComponent from './date';
import type StatusComponent from './status';
import type EmojiComponent from './emoji';
import type PanelComponent from './panel';
import type EmbedCardComponent from './embedCard';
import type InlineCardComponent from './inlineCard';
import type BlockCardComponent from './blockCard';
import type MediaComponent from './media';
import type MediaGroupComponent from './mediaGroup';
import type MediaInlineComponent from './mediaInline';
import type MediaSingleComponent from './mediaSingle';
import type MentionComponent from './mention';
import type ExpandComponent from '../../ui/Expand';

import type CodeBlockComponent from './codeBlock/codeBlock';

const CodeBlock = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_CodeBlock" */
			'./codeBlock/codeBlock'
		).then((mod) => mod.default) as Promise<typeof CodeBlockComponent>,
);

const TaskList = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_TaskList" */
			'./taskList'
		).then((mod) => mod.default) as Promise<typeof TaskListComponent>,
);

const TaskItem = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_TaskItem" */
			'./taskItem'
		).then((mod) => mod.default) as Promise<typeof TaskItemComponent>,
);

const DecisionList = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_DecisionList" */
			'./decisionList'
		).then((mod) => mod.default) as Promise<typeof DecisionListComponent>,
);

const DecisionItem = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_DecisionItem" */
			'./decisionItem'
		).then((mod) => mod.default) as Promise<typeof DecisionItemComponent>,
);

const Date = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Date" */
			'./date'
		).then((mod) => mod.default) as Promise<typeof DateComponent>,
);

const Status = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Status" */
			'./status'
		).then((mod) => mod.default) as Promise<typeof StatusComponent>,
);

const Emoji = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Emoji" */
			'./emoji'
		).then((mod) => mod.default) as Promise<typeof EmojiComponent>,
);

const Panel = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Panel" */
			'./panel'
		).then((mod) => mod.default) as Promise<typeof PanelComponent>,
);

const EmbedCard = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_EmbedCard" */
			'./embedCard'
		).then((mod) => mod.default) as Promise<typeof EmbedCardComponent>,
);

const InlineCard = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_InlineCard" */
			'./inlineCard'
		).then((mod) => mod.default) as Promise<typeof InlineCardComponent>,
);

const BlockCard = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_BlockCard" */
			'./blockCard'
		).then((mod) => mod.default) as Promise<typeof BlockCardComponent>,
);

const Media = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Media" */
			'./media'
		).then((mod) => mod.default) as Promise<typeof MediaComponent>,
);

const MediaGroup = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_MediaGroup" */
			'./mediaGroup'
		).then((mod) => mod.default) as Promise<typeof MediaGroupComponent>,
);

const MediaInline = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_MediaInline" */
			'./mediaInline'
		).then((mod) => mod.default) as Promise<typeof MediaInlineComponent>,
);

const MediaSingle = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_MediaSingle" */
			'./mediaSingle'
		).then((mod) => mod.default) as Promise<typeof MediaSingleComponent>,
);

const Mention = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Mention" */
			'./mention'
		).then((mod) => mod.default) as Promise<typeof MentionComponent>,
);

const Expand = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Expand" */
			'../../ui/Expand'
		).then((mod) => mod.default) as Promise<typeof ExpandComponent>,
);

export const nodeToReact: {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: React.ComponentType<React.PropsWithChildren<any>>;
} = {
	blockCard: BlockCard,
	date: Date,
	decisionItem: DecisionItem,
	decisionList: DecisionList,
	emoji: Emoji,
	codeBlock: CodeBlock,
	inlineCard: InlineCard,
	media: Media,
	mediaGroup: MediaGroup,
	mediaInline: MediaInline,
	mediaSingle: MediaSingle,
	mention: Mention,
	panel: Panel,
	status: Status,
	taskItem: TaskItem,
	taskList: TaskList,
	table: Table,
	tableRow: TableRow,
	expand: Expand,
	nestedExpand: Expand,
	embedCard: EmbedCard,
};
