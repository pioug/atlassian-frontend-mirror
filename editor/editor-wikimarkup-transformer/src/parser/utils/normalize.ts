import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { createParagraphNodeFromInlineNodes, createEmptyParagraphNode } from '../nodes/paragraph';
import { TableBuilder } from '../builder/table-builder';

export function normalizePMNodes(nodes: PMNode[], schema: Schema, parentNode?: string): PMNode[] {
	return [normalizeMediaGroups, normalizeInlineNodes].reduce(
		(currentNodes, normFunc) => normFunc(currentNodes, schema, parentNode),
		nodes,
	);
}

export function normalizeInlineNodes(
	nodes: PMNode[],
	schema: Schema,
	parentNode?: string,
): PMNode[] {
	const output: PMNode[] = [];
	let inlineNodeBuffer: PMNode[] = [];
	for (const node of nodes) {
		if (!node.isBlock) {
			inlineNodeBuffer.push(node);
			continue;
		}
		if (inlineNodeBuffer.length > 0) {
			output.push(...createParagraphNodeFromInlineNodes(inlineNodeBuffer, schema));
		}
		inlineNodeBuffer = []; // clear buffer
		if (node?.type?.name === 'nestedExpand' && parentNode === 'doc') {
			//ADFEXP-227 handle nested expand at root level
			output.push(wrapNestedExpandInTable(node, schema));
		} else {
			output.push(node);
		}
	}
	if (inlineNodeBuffer.length > 0) {
		output.push(...createParagraphNodeFromInlineNodes(inlineNodeBuffer, schema));
	}
	if (output.length === 0) {
		return [createEmptyParagraphNode(schema)];
	}
	return output;
}

/**
 * Normalize the list of the given nodes for media groups.
 * The rule is: if there are consecutive media group nodes (each with a single child media
 * node) separated by any space or a single newline, then merge them into one media group
 * with multiple child media nodes.
 * @param nodes list of nodes to normalize. Must not be null
 * @param schema
 */
function normalizeMediaGroups(nodes: PMNode[], schema: Schema, parentNode?: string): PMNode[] {
	const output: PMNode[] = [];
	let mediaGroupBuffer: PMNode[] = [];
	let separatorBuffer: PMNode[] = [];
	for (const n of nodes) {
		if (n.type.name === 'mediaGroup' && n.childCount === 1) {
			mediaGroupBuffer.push(n);
			//separator buffer keeps track of the seperator(s) between each mediaGroup nodes,
			//so needs resetting every time we encounter a new mediaGroup node
			separatorBuffer = [];
			continue;
		}
		if (mediaGroupBuffer.length > 0) {
			if (isSignificantSeparatorNode(n, separatorBuffer)) {
				output.push(createMergedMediaGroup(mediaGroupBuffer, schema));
				output.push(...separatorBuffer);
				output.push(n);
				mediaGroupBuffer = [];
				separatorBuffer = [];
			} else {
				separatorBuffer.push(n);
			}
			continue;
		}
		output.push(n);
	}
	if (mediaGroupBuffer.length > 0) {
		output.push(createMergedMediaGroup(mediaGroupBuffer, schema));
	}
	// Dump everything else from separator buffer if anything is left
	output.push(...separatorBuffer);
	return output;
}

/**
 * Creates a single mediaGroup whose children are the single media elements from the given mediaGroupNodes.
 * @param mediaGroupNodes list of mediaGroups that have a single child each
 * @param schema the schema
 */
function createMergedMediaGroup(mediaGroupNodes: PMNode[], schema: Schema): PMNode {
	const { mediaGroup } = schema.nodes;
	const mediaNodes: PMNode[] = mediaGroupNodes.map((v) => v.child(0));
	return mediaGroup.createChecked({}, mediaNodes);
}

function isSignificantSeparatorNode(n: PMNode, separatorBuffer: PMNode[]): boolean {
	return (
		isHardBreak(n, separatorBuffer) || !isEmptyTextNode(n) || isMediaGroupWithMultipleChildren(n)
	);
}
/**
 * Existing media groups with more than one child is considered as a significant separator.
 */
function isMediaGroupWithMultipleChildren(n: PMNode): boolean {
	return n.type.name === 'mediaGroup' && n.childCount > 1;
}

/**
 * If the current node is a hard break, AND there's already at least
 * one hard break in the separator buffer, then we want to return true.
 * @param n the current node to examine
 * @param separatorBuffer the existing separator buffer.
 */
function isHardBreak(n: PMNode, separatorBuffer: PMNode[]): boolean {
	return (
		n.type.name === 'hardBreak' &&
		separatorBuffer.map((v) => v.type.name).indexOf('hardBreak') !== -1
	);
}

function isEmptyTextNode(n: PMNode): boolean {
	return n.textContent !== undefined && n.textContent.trim().length === 0;
}

export function isNextLineEmpty(input: string) {
	// Line with only spaces is considered an empty line
	return input.trim().length === 0;
}

function wrapNestedExpandInTable(node: PMNode, schema: Schema) {
	const builder = new TableBuilder(schema);
	const cell = {
		style: '|',
		content: [node],
	};
	builder.add([cell]);
	const tableNode = builder.buildPMNode();
	return tableNode;
}
