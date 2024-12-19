import { isListNode, mapChildren, mapSlice } from '@atlaskit/editor-common/utils';
import { autoJoin } from '@atlaskit/editor-prosemirror/commands';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Mark, Node, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState } from '@atlaskit/editor-prosemirror/state';

import { PastePluginActionTypes as ActionTypes } from '../editor-actions/actions';
import { createCommand } from '../pm-plugins/plugin-factory';

/**
 * Use this to register macro link positions during a paste operation, that you
 * want to track in a document over time, through any document changes.
 *
 * @param positions a map of string keys (custom position references) and position values e.g. { ['my-key-1']: 11 }
 *
 * **Context**: This is neccessary if there is an async process or an unknown period of time
 * between obtaining an original position, and wanting to know about what its final eventual
 * value. In that scenario, positions will need to be actively tracked and mapped in plugin
 * state so that they can be mapped through any other independent document change transactions being
 * dispatched to the editor that could affect their value.
 */
export const startTrackingPastedMacroPositions = (pastedMacroPositions: {
	[key: string]: number;
}) =>
	createCommand(() => {
		return {
			type: ActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS,
			pastedMacroPositions,
		};
	});

export const stopTrackingPastedMacroPositions = (pastedMacroPositionKeys: string[]) =>
	createCommand(() => {
		return {
			type: ActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS,
			pastedMacroPositionKeys,
		};
	});

// matchers for text lists
const bullets = /^\s*[\*\-\u2022](\s+|\s+$)/;
const numbers = /^\s*\d[\.\)](\s+|$)/;

const isListItem = (node: Node | null, schema: Schema): boolean => {
	return Boolean(node && node.type === schema.nodes.listItem);
};

const getListType = (node: Node, schema: Schema): [NodeType, number] | null => {
	if (!node || !node.text) {
		return null;
	}

	const { bulletList, orderedList } = schema.nodes;

	return [
		{
			node: bulletList,
			matcher: bullets,
		},
		{
			node: orderedList,
			matcher: numbers,
		},
	].reduce((lastMatch: [NodeType, number] | null, listType) => {
		if (lastMatch) {
			return lastMatch;
		}

		const match = node.text!.match(listType.matcher);
		return match ? [listType.node, match[0].length] : lastMatch;
	}, null);
};

// Splits array of nodes by hardBreak. E.g.:
// [text "1. ", em "hello", date, hardbreak, text "2. ",
//  subsup "world", hardbreak, text "smile"]
// => [
//      [ text "1. ", em "hello", date ],
//      [hardbreak, text "2. ", subsup "world"],
//      [hardbreak, text "smile"]
//    ]
export const _contentSplitByHardBreaks = (content: Array<Node>, schema: Schema): Array<Node>[] => {
	const wrapperContent: Array<Node>[] = [];
	let nextContent: Array<Node> = [];

	content.forEach((node) => {
		if (node.type === schema.nodes.hardBreak) {
			if (nextContent.length !== 0) {
				wrapperContent.push(nextContent);
			}
			nextContent = [node];
		} else {
			nextContent.push(node);
		}
	});

	wrapperContent.push(nextContent);
	return wrapperContent;
};

export const extractListFromParagraph = (
	node: Node,
	parent: Node | null,
	schema: Schema,
): Fragment => {
	const content: Array<Node> = mapChildren(node.content, (node) => node);
	const linesSplitByHardbreaks = _contentSplitByHardBreaks(content, schema);
	const { paragraph, hardBreak, listItem, orderedList } = schema.nodes;

	const splitListsAndParagraphs: Node[] = [];

	let paragraphParts: Array<Node[]> = [];

	for (var index = 0; index < linesSplitByHardbreaks.length; index = index + 1) {
		const line = linesSplitByHardbreaks[index];
		let listMatch: [NodeType, number] | null;
		if (index === 0) {
			if (line[0]?.type === hardBreak) {
				paragraphParts.push(line);
				continue;
			} else {
				// the first line the potential list item is at postion 0
				listMatch = getListType(line[0], schema);
			}
		} else {
			// lines after the first the potential list item is at postion 1
			if (line.length === 1) {
				// if the line only has a line break return as is
				paragraphParts.push(line);
				continue;
			}

			listMatch = getListType(line[1], schema);
		}
		if (
			!listMatch ||
			// CONFCLOUD-79708: If we are inside a list - let's not try to upgrade list as it resolves
			// to invalid content
			isListItem(parent, schema)
		) {
			// if there is not list match return as is
			paragraphParts.push(line);
			continue;
		}

		const [nodeType, length] = listMatch;
		const firstNonHardBreakNode = line.find((node) => node.type !== hardBreak);
		const chunksWithoutLeadingHardBreaks = line.slice(
			line.findIndex((node) => node.type !== hardBreak),
		);

		// retain text after bullet or number-dot e.g. 1. Hello
		const startingText = firstNonHardBreakNode?.text?.substr(length);
		const restOfChunk = startingText
			? // apply transformation to first entry
				([
					schema.text(startingText, firstNonHardBreakNode?.marks),
					...chunksWithoutLeadingHardBreaks.slice(1),
				] as Node[])
			: chunksWithoutLeadingHardBreaks.slice(1);

		// convert to list
		const listItemNode = listItem?.createAndFill(
			undefined,
			paragraph.createChecked(undefined, restOfChunk),
		);

		if (!listItemNode) {
			paragraphParts.push(line);
			continue;
		}
		const attrs =
			nodeType === orderedList
				? {
						order: parseInt(firstNonHardBreakNode!.text!.split('.')[0]),
					}
				: undefined;
		const newList = nodeType.createChecked(attrs, [listItemNode]);

		if (
			paragraphParts.length !== 0 &&
			paragraph.validContent(Fragment.from(paragraphParts.flat()))
		) {
			splitListsAndParagraphs.push(
				paragraph.createAndFill(node.attrs, paragraphParts.flat(), node.marks) as Node,
			);
			paragraphParts = [];
		}
		splitListsAndParagraphs.push(newList);
	}

	if (paragraphParts.length !== 0 && paragraph.validContent(Fragment.from(paragraphParts.flat()))) {
		splitListsAndParagraphs.push(
			schema.nodes.paragraph.createAndFill(node.attrs, paragraphParts.flat(), node.marks) as Node,
		);
	}
	const result = splitListsAndParagraphs.flat();
	// try to join
	const mockState = EditorState.create({
		schema,
	});

	let joinedListsTr: Transaction | undefined;
	const mockDispatch = (tr: Transaction) => {
		joinedListsTr = tr;
	};

	// Return false to prevent replaceWith from wrapping the text node in a paragraph
	// paragraph since that will be done later. If it's done here, it will fail
	// the paragraph.validContent check.
	// Dont return false if there are lists, as they arent validContent for paragraphs
	// and will result in hanging textNodes
	autoJoin(
		(state, dispatch) => {
			if (!dispatch) {
				return false;
			}
			const containsList = result.some(
				(node) => node.type === schema.nodes.bulletList || node.type === schema.nodes.orderedList,
			);
			if (result.some((node) => node.isText) && !containsList) {
				return false;
			}

			dispatch(state.tr.replaceWith(0, 2, result));
			return true;
		},
		(before, after) => isListNode(before) && isListNode(after),
	)(mockState, mockDispatch);
	const fragment = joinedListsTr ? joinedListsTr.doc.content : Fragment.from(result);
	return fragment;
};

// above will wrap everything in paragraphs for us
export const upgradeTextToLists = (slice: Slice, schema: Schema): Slice => {
	return mapSlice(slice, (node, parent) => {
		if (node.type === schema.nodes.paragraph) {
			return extractListFromParagraph(node, parent, schema);
		}

		return node;
	});
};

export const splitParagraphs = (slice: Slice, schema: Schema): Slice => {
	// exclude Text nodes with a code mark, since we transform those later
	// into a codeblock
	let hasCodeMark = false;
	slice.content.forEach((child) => {
		hasCodeMark = hasCodeMark || child.marks.some((mark) => mark.type === schema.marks.code);
	});

	// slice might just be a raw text string
	if (schema.nodes.paragraph.validContent(slice.content) && !hasCodeMark) {
		const replSlice = splitIntoParagraphs({ fragment: slice.content, schema });
		return new Slice(replSlice, slice.openStart + 1, slice.openEnd + 1);
	}

	return mapSlice(slice, (node) => {
		if (node.type === schema.nodes.paragraph) {
			return splitIntoParagraphs({
				fragment: node.content,
				blockMarks: node.marks,
				schema,
			});
		}

		return node;
	});
};

/**
 * Walks the slice, creating paragraphs that were previously separated by hardbreaks.
 * Returns the original paragraph node (as a fragment), or a fragment containing multiple nodes.
 */
export const splitIntoParagraphs = ({
	fragment,
	blockMarks = [],
	schema,
}: {
	fragment: Fragment;
	blockMarks?: readonly Mark[];
	schema: Schema;
}): Fragment => {
	const paragraphs = [];
	let curChildren: Array<Node> = [];
	let lastNode: Node | null = null;

	const { hardBreak, paragraph } = schema.nodes;

	fragment.forEach((node, i) => {
		const isNodeValidContentForParagraph = schema.nodes.paragraph.validContent(Fragment.from(node));

		if (!isNodeValidContentForParagraph) {
			paragraphs.push(node);
			return;
		}
		// ED-14725 Fixed the issue that it make duplicated line
		// when pasting <br /> from google docs.
		if (i === 0 && node.type === hardBreak) {
			paragraphs.push(paragraph.createChecked(undefined, curChildren, [...blockMarks]));
			lastNode = node;
			return;
		} else if (lastNode && lastNode.type === hardBreak && node.type === hardBreak) {
			// double hardbreak

			// backtrack a little; remove the trailing hardbreak we added last loop
			curChildren.pop();

			// create a new paragraph
			paragraphs.push(paragraph.createChecked(undefined, curChildren, [...blockMarks]));
			curChildren = [];
			return;
		}

		// add to this paragraph
		curChildren.push(node);
		lastNode = node;
	});

	if (curChildren.length) {
		paragraphs.push(paragraph.createChecked(undefined, curChildren, [...blockMarks]));
	}
	return Fragment.from(
		paragraphs.length
			? paragraphs
			: [paragraph.createAndFill(undefined, undefined, [...blockMarks])!],
	);
};
