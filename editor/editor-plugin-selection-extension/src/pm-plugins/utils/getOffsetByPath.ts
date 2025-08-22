import { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// TODO: ED-28434 - move this to a shared package
// mirror code from https://bitbucket.org/atlassian/pf-adf-service/src/master/src/lib/update/get-offset.ts
export interface NodeOffset {
	from: number;
	matches: string[];
	to: number;
	type: 'node';
}
export interface AttrsOffset {
	from: number;
	path: string[];
	type: 'attrs';
	// To be implemented
	// matches: string[];
}
export type Offset = NodeOffset | AttrsOffset;

export function getOffsetByPath(
	root: PMNode,
	pos: number,
	pointer: string,
	from = 0,
	to?: number,
): Offset {
	const parts = pointer.split('/');

	let ref: PMNode | Fragment = root;
	const len = parts.length;
	// -1 to account for the root node (usually doc)
	// The start of the document, right before the first content, is position 0.
	let offset = pos; //-1;

	for (let i = 1; i < len; i++) {
		const key = parts[i];
		// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
		if (ref instanceof Fragment && /^[0-9]+$/u.test(key)) {
			let index = parseInt(key, 10);
			if (index >= ref.childCount) {
				throw new Error(`JSON pointer "${pointer}" points to non-existing location.`);
			}
			const nextRef: PMNode = ref.child(index);
			while (index--) {
				offset += ref.child(index).nodeSize;
			}
			ref = nextRef;
		} else if (ref instanceof PMNode) {
			/**
			 * Reference: https://prosemirror.net/docs/guide/#doc.data_structures
			 * +----------------------------------+
			 * |              Node                |
			 * |              ^^^^                |
			 * | type:       NodeType             |
			 * | content:    Fragment             |
			 * |              [ Node, Node, ...]  |
			 * | attrs:      Object               |
			 * | marks:      Mark                 |
			 * |              [                   |
			 * |                type: MarkType    |
			 * |                attrs: Object     |
			 * |              ]                   |
			 * +----------------------------------+
			 */
			switch (key) {
				case 'content':
					// Entering or leaving a node that is not a leaf node (i.e. supports content) counts as one token.
					offset++;
					ref = ref.content;
					break;

				case 'attrs':
					return {
						type: 'attrs',
						from: offset + from,
						path: parts.slice(i + 1),
					};

				case 'text':
					if (!ref.isText) {
						throw new Error(`"${parts.slice(0, i).join('/')}" doesn't have any "text" node!`);
					}
					continue;

				default:
					throw new Error(`JSON pointer "${pointer}" points to an unsupported location.`);
			}
		} else {
			throw new Error(`JSON pointer "${pointer}" points to an unsupported entity.`);
		}
	}

	if (ref instanceof Fragment) {
		throw new Error(`Expected a Node, but the JSON pointer "${pointer}" points to a Fragment.`);
	}

	return {
		type: 'node',
		from: offset + from,
		to: offset + (to ?? ref.nodeSize),
		matches: [to ? ref.textBetween(from, to) : ref.textContent],
	};
}
