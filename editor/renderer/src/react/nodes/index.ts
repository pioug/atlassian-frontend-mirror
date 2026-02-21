/* eslint-disable @atlaskit/editor/no-re-export */
// Mapping file
import type React from 'react';
import Loadable from 'react-loadable';
import type { Fragment, Node, Mark } from '@atlaskit/editor-prosemirror/model';
import { UnsupportedBlock, UnsupportedInline } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';

import Blockquote from './blockquote';
import BodiedExtension from './bodiedExtension';
import MultiBodiedExtension from './multiBodiedExtension';
import ExtensionFrame from './extensionFrame';
import BulletList from './bulletList';

import Doc, { DocWithSelectAllTrap } from './doc';
import Extension from './extension';
import HardBreak from './hardBreak';
import Heading from './heading';
import InlineExtension from './inlineExtension';
import LayoutSection from './layoutSection';
import LayoutColumn from './layoutColumn';
import ListItem from './listItem';
import Caption from './caption';
import OrderedList from './orderedList';
import Paragraph from './paragraph';
import Placeholder from './placeholder';
import Rule from './rule';
import Table from './table';
import { TableCell, TableHeader } from './tableCell';
import TableRow from './tableRow';
import UnknownBlock from './unknownBlock';

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
import type { NodeComponentsProps } from '../../ui/Renderer/types';

import type CodeBlockComponent from './codeBlock/codeBlock';
import type WindowedCodeBlockComponent from './codeBlock/windowedCodeBlock';
import type SyncBlock from './syncBlock';
import type BodiedSyncBlockComponent from './bodiedSyncBlock';

const WindowedCodeBlock = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_WindowedCodeBlock" */
			'./codeBlock/windowedCodeBlock'
		).then((mod) => mod.default) as Promise<typeof WindowedCodeBlockComponent>,
	loading: () => null,
});

const CodeBlock = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_CodeBlock" */
			'./codeBlock/codeBlock'
		).then((mod) => mod.default) as Promise<typeof CodeBlockComponent>,
	loading: () => null,
});

const TaskList = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_TaskList" */
			'./taskList'
		).then((mod) => mod.default) as Promise<typeof TaskListComponent>,
	loading: () => null,
});

const TaskItem = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_TaskItem" */
			'./taskItem'
		).then((mod) => mod.default) as Promise<typeof TaskItemComponent>,
	loading: () => null,
});

const DecisionList = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_DecisionList" */
			'./decisionList'
		).then((mod) => mod.default) as Promise<typeof DecisionListComponent>,
	loading: () => null,
});

const DecisionItem = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_DecisionItem" */
			'./decisionItem'
		).then((mod) => mod.default) as Promise<typeof DecisionItemComponent>,
	loading: () => null,
});

const Date = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Date" */
			'./date'
		).then((mod) => mod.default) as Promise<typeof DateComponent>,
	loading: () => null,
});

const Status = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Status" */
			'./status'
		).then((mod) => mod.default) as Promise<typeof StatusComponent>,
	loading: () => null,
});

const Emoji = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Emoji" */
			'./emoji'
		).then((mod) => mod.default) as Promise<typeof EmojiComponent>,
	loading: () => null,
});

const Panel = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Panel" */
			'./panel'
		).then((mod) => mod.default) as Promise<typeof PanelComponent>,
	loading: () => null,
});

const EmbedCard = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_EmbedCard" */
			'./embedCard'
		).then((mod) => mod.default) as Promise<typeof EmbedCardComponent>,
	loading: () => null,
});

const InlineCard = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_InlineCard" */
			'./inlineCard'
		).then((mod) => mod.default) as Promise<typeof InlineCardComponent>,
	loading: () => null,
});

const BlockCard = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_BlockCard" */
			'./blockCard'
		).then((mod) => mod.default) as Promise<typeof BlockCardComponent>,
	loading: () => null,
});

const Media = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Media" */
			'./media'
		).then((mod) => mod.default) as Promise<typeof MediaComponent>,
	loading: () => null,
});

const MediaGroup = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_MediaGroup" */
			'./mediaGroup'
		).then((mod) => mod.default) as Promise<typeof MediaGroupComponent>,
	loading: () => null,
});

const MediaInline = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_MediaInline" */
			'./mediaInline'
		).then((mod) => mod.default) as Promise<typeof MediaInlineComponent>,
	loading: () => null,
});

const MediaSingle = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_MediaSingle" */
			'./mediaSingle'
		).then((mod) => mod.default) as Promise<typeof MediaSingleComponent>,
	loading: () => null,
});

const Mention = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Mention" */
			'./mention'
		).then((mod) => mod.default) as Promise<typeof MentionComponent>,
	loading: () => null,
});

const Expand = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_Expand" */
			'../../ui/Expand'
		).then((mod) => mod.default) as Promise<typeof ExpandComponent>,
	loading: () => null,
});

const SyncBlockLoader = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_SyncBlock" */
			'./syncBlock'
		).then((mod) => mod.default) as Promise<typeof SyncBlock>,
	loading: () => null,
});

const BodiedSyncBlock = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-node_BodiedSyncBlock" */ './bodiedSyncBlock'
		).then((mod) => mod.default) as Promise<typeof BodiedSyncBlockComponent>,
	loading: () => null,
});

export const nodeToReact: {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: React.ComponentType<React.PropsWithChildren<any>>;
} = {
	blockquote: Blockquote,
	bulletList: BulletList,
	blockCard: BlockCard,
	caption: Caption,
	date: Date,
	decisionItem: DecisionItem,
	decisionList: DecisionList,
	doc: Doc,
	emoji: Emoji,
	extension: Extension,
	bodiedExtension: BodiedExtension,
	multiBodiedExtension: MultiBodiedExtension,
	extensionFrame: ExtensionFrame,
	hardBreak: HardBreak,
	heading: Heading,
	inlineCard: InlineCard,
	inlineExtension: InlineExtension,
	layoutSection: LayoutSection,
	layoutColumn: LayoutColumn,
	listItem: ListItem,
	media: Media,
	mediaGroup: MediaGroup,
	mediaInline: MediaInline,
	mediaSingle: MediaSingle,
	mention: Mention,
	orderedList: OrderedList,
	panel: Panel,
	paragraph: Paragraph,
	placeholder: Placeholder,
	rule: Rule,
	status: Status,
	taskItem: TaskItem,
	taskList: TaskList,
	table: Table,
	tableCell: TableCell,
	tableHeader: TableHeader,
	tableRow: TableRow,
	unknownBlock: UnknownBlock,
	unsupportedBlock: UnsupportedBlock,
	unsupportedInline: UnsupportedInline,
	expand: Expand,
	syncBlock: SyncBlockLoader,
	bodiedSyncBlock: BodiedSyncBlock,
	nestedExpand: Expand,
	embedCard: EmbedCard,
	blockTaskItem: TaskItem,
};

interface ToReactFlags {
	allowSelectAllTrap?: boolean;
	allowWindowedCodeBlock?: boolean;
}

export const toReact = (
	node: Node,
	flags?: ToReactFlags,
	nodeComponents?: NodeComponentsProps,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ComponentType<React.PropsWithChildren<any>> => {
	if (node.type.name === 'doc' && flags?.allowSelectAllTrap === true) {
		return DocWithSelectAllTrap;
	}

	if (!fg('jfp-magma-ssr-iv-editor-codeblock')) {
		if (node.type.name === 'codeBlock') {
			if (flags?.allowWindowedCodeBlock === true) {
				return WindowedCodeBlock;
			}
			return CodeBlock;
		}
	}

	// Allowing custom components to override those provided in nodeToReact
	const nodes = {
		...nodeToReact,
		...nodeComponents,
	};

	if (fg('jfp-magma-ssr-iv-editor-codeblock')) {
		if (node.type.name === 'codeBlock') {
			if (flags?.allowWindowedCodeBlock === true) {
				return nodes.windowedCodeBlock ?? WindowedCodeBlock;
			}
			return nodes.codeBlock ?? CodeBlock;
		}
	}

	nodes['multiBodiedExtension'] = MultiBodiedExtension;
	return nodes[node.type.name];
};

export interface TextWrapper {
	content: Node[];
	nodeSize: number;
	type: {
		name: 'textWrapper';
	};
}

interface NodeSimple {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs?: any;
	nodeSize: number;
	text?: string;
	type: {
		name: string;
	};
}

/*
 *  Wraps adjacent textnodes in a textWrapper
 *
 *  Input:
 *  [
 *    {
 *      type: 'text',
 *      text: 'Hello'
 *    },
 *    {
 *      type: 'text',
 *      text: 'World!',
 *      marks: [
 *        {
 *          type: 'strong'
 *        }
 *      ]
 *    }
 *  ]
 *
 *  Output:
 *  [
 *    {
 *      type: 'textWrapper',
 *      content: [
 *        {
 *          type: 'text',
 *          text: 'Hello'
 *        },
 *        {
 *          type: 'text',
 *          text: 'World!',
 *          marks: [
 *            {
 *              type: 'strong'
 *            }
 *          ]
 *        }
 *      ]
 *    }
 *  ]
 */
export const mergeTextNodes = (nodes: (Node | NodeSimple)[]) => {
	return nodes.reduce<(TextWrapper | Node | NodeSimple)[]>((acc, current) => {
		if (!isText(current.type.name)) {
			acc.push(current);
			return acc;
		}

		// Append node to previous node, if it was a text wrapper
		if (acc.length > 0 && isTextWrapper(acc[acc.length - 1])) {
			const textWrapper = acc[acc.length - 1] as TextWrapper;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			textWrapper.content!.push(current as Node);
			textWrapper.nodeSize += current.nodeSize;
		} else {
			acc.push({
				type: {
					name: 'textWrapper',
				},
				content: [current],
				nodeSize: current.nodeSize,
			} as TextWrapper);
		}

		return acc;
	}, []);
};

export const isText = (type: string): type is 'text' => {
	return type === 'text';
};

export const isTextWrapper = (node: Node | TextWrapper | NodeSimple): node is TextWrapper => {
	return node.type.name === 'textWrapper';
};

export function isTextNode(node: Node | Mark): node is Node {
	return node.type.name === 'text';
}

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const whitespaceRegex = /^\s*$/;

/**
 * Detects whether a fragment contains a single paragraph node
 * whose content satisfies the condition for an emoji block
 */
export const isEmojiDoc = (doc: Fragment): boolean => {
	if (doc.childCount !== 1) {
		return false;
	}
	const parentNodes: Node[] = [];
	doc.forEach((child) => parentNodes.push(child));
	const node = parentNodes[0];
	return node.type.name === 'paragraph' && isEmojiBlock(node.content);
};

const isEmojiBlock = (pnode: Fragment): boolean => {
	const content: Node[] = [];
	// Optimisation for long documents - worst case block will be space-emoji-space
	if (pnode.childCount > 7) {
		return false;
	}
	pnode.forEach((child) => content.push(child));
	let emojiCount = 0;
	for (let i = 0; i < content.length; ++i) {
		const node = content[i];
		switch (node.type.name) {
			case 'text':
				if (node.text && !node.text.match(whitespaceRegex)) {
					return false;
				}
				continue;
			case 'emoji':
				if (++emojiCount > 3) {
					return false;
				}
				continue;
			default:
				// Only text and emoji nodes are allowed
				return false;
		}
	}
	return emojiCount > 0;
};

export {
	Blockquote,
	BodiedExtension,
	BulletList,
	BlockCard,
	Caption,
	CodeBlock,
	WindowedCodeBlock,
	Date,
	DecisionItem,
	DecisionList,
	Doc,
	DocWithSelectAllTrap,
	Emoji,
	Extension,
	ExtensionFrame,
	Expand,
	HardBreak,
	Heading,
	ListItem,
	InlineCard,
	InlineExtension,
	LayoutSection,
	LayoutColumn,
	Media,
	MediaGroup,
	MediaInline,
	MediaSingle,
	Mention,
	MultiBodiedExtension,
	OrderedList,
	Panel,
	Paragraph,
	Placeholder,
	Rule,
	Status,
	TaskItem,
	TaskList,
	Table,
	TableCell,
	TableRow,
	UnknownBlock,
	EmbedCard,
};
