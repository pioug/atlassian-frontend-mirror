import { type Node } from '@atlaskit/editor-prosemirror/model';
import { type ReadonlyTransaction, type Transaction } from '@atlaskit/editor-prosemirror/state';

import { appearanceForNodeType } from '../../pm-plugins/utils';

import { type Entity, EVENT_SUBJECT } from './types';

export function isDatasourceNode(node: Node) {
	return 'datasource' in node.attrs && !!node.attrs.datasource;
}

/**
 * Determine if a node is considered to be a link
 */
export const isLinkNode = (node: Node) => {
	if (isDatasourceNode(node)) {
		return false;
	}

	if (!!appearanceForNodeType(node.type)) {
		return true;
	}

	return hasLinkMark(node);
};

export function getNodeSubject(node: Node) {
	if (isDatasourceNode(node)) {
		return EVENT_SUBJECT.DATASOURCE;
	}
	if (isLinkNode(node)) {
		return EVENT_SUBJECT.LINK;
	}
	return null;
}

/**
 * Analytics appearance for link object
 */
export function appearanceForLink(node: Node) {
	const appearance = appearanceForNodeType(node.type);
	if (appearance) {
		return appearance;
	}

	return 'url';
}

const getLinkMark = (node: Node) => {
	if (node.marks) {
		for (let i = 0; i < node.marks.length; i++) {
			const mark = node.marks[i];
			if (mark.type.name === 'link') {
				return mark;
			}
		}
	}
};

const hasLinkMark = (node: Node) => {
	return !!getLinkMark(node);
};

export function getUrl(node: Node): string | undefined {
	return node.attrs?.url ?? getLinkMark(node)?.attrs?.href;
}

export const getNodeContext = (doc: Node, pos: number): string => {
	const $pos = doc.resolve(pos);

	const maxDepth = 3;
	for (let i = 0; i <= maxDepth; i++) {
		const node = $pos.node($pos.depth - i);
		if (node && node.type.name !== 'paragraph') {
			return node.type.name;
		}
	}

	return 'unknown';
};

export const findAtPositions = (tr: Transaction | ReadonlyTransaction, positions: number[]) => {
	const entities: Entity[] = [];

	for (let i = 0; i < positions.length; i++) {
		const pos = positions[i];
		const node = tr.doc.nodeAt(pos);

		if (!node) {
			continue;
		}

		const nodeContext = getNodeContext(tr.doc, pos);

		entities.push({
			pos,
			node,
			nodeContext,
		});
	}

	return entities;
};

export const findInNodeRange = (
	doc: Node,
	from: number,
	to: number,
	predicate: (node: Node) => boolean,
) => {
	const entities: Entity[] = [];

	doc.nodesBetween(from, to, (node, pos) => {
		if (predicate(node)) {
			const entirelyInRange = pos >= from && pos + node.nodeSize <= to;

			if (entirelyInRange) {
				const nodeContext = getNodeContext(doc, pos);

				entities.push({
					pos,
					node,
					nodeContext,
				});
			}
		}
	});

	return entities;
};

/**
 * Returns whether or not two sets of links appear to likely be the same set of links
 * That they are in the same order and that both their hrefs and appearances match
 */
export const areSameNodes = (setA: Entity[], setB: Entity[]) => {
	if (setA.length !== setB.length) {
		return false;
	}

	for (let i = 0; i < setA.length; i++) {
		const a = setA[i];
		const b = setB[i];

		if (
			getUrl(a.node) !== getUrl(b.node) ||
			appearanceForLink(a.node) !== appearanceForLink(b.node)
		) {
			return false;
		}
	}

	return true;
};
