import ReactSerializer from '..';
import type { Mark, Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns an array of **backgroundColor marks** that should be considered "standalone"
 * for highlight padding purposes.
 *
 * Standalone backgroundColor marks are determined by scanning the content array and
 * checking for backgroundColor marks that are separated by whitespace boundaries.
 *
 * @param content Array of ProseMirror nodes to scan for standalone backgroundColor marks.
 * @returns Array of backgroundColor marks that are standalone.
 */
export const getStandaloneBackgroundColorMarks = (content: Node[]): Mark[] => {
	const standaloneMarks: Mark[] = [];
	// keep track of the previous node's state
	let prev: null | {
		hasBackgroundColor?: boolean;
		selfSpaceOnTheRight: boolean; // used to determine if next node has space on the left
		spaceToTheLeft?: boolean; // if next node has space on the left, then it's standalone
	} = {
		selfSpaceOnTheRight: true, // initial value to handle leading BackgroundColor
	};
	let prevNode: null | Node = null;
	// Iterates through each node in the content array.
	// Tracks if the previous node had a backgroundColor mark and if it ended with a space.
	// If a backgroundColor mark is followed by a text node that starts with a space,
	// and the previous node ended with a space, the previous backgroundColor mark is considered standalone.
	// At the end, flushes any remaining node that meets the standalone criteria.
	for (let i = 0; i < content.length; i++) {
		const node: Node = content[i];
		const nodeMarks = ReactSerializer.getMarks(node);
		const isBackgroundColor = nodeMarks.some((m) => m.type.name === 'backgroundColor');
		let selfSpaceOnTheLeft = false;
		let selfSpaceOnTheRight = false;
		if (node.text) {
			selfSpaceOnTheLeft = node.text.startsWith(' ');
			selfSpaceOnTheRight = node.text.endsWith(' ');
		}

		if (isBackgroundColor) {
			prevNode = node;
			prev = {
				selfSpaceOnTheRight: false,
				hasBackgroundColor: true,
				spaceToTheLeft: prev !== null && prev.selfSpaceOnTheRight,
			};
		} else {
			// If prev exists, check for standalone logic
			if (prev && prev.hasBackgroundColor && prevNode) {
				// If prev had space on the left and current is a TextNode and has space on the left
				if (prev.spaceToTheLeft && selfSpaceOnTheLeft) {
					const mark = ReactSerializer.getMarks(prevNode).find(
						(m) => m.type.name === 'backgroundColor',
					);
					if (mark) {
						standaloneMarks.push(mark);
					}
				}
			}
			prevNode = null;
			prev = {
				selfSpaceOnTheRight,
				hasBackgroundColor: false,
			};
		}
	}
	if (prevNode) {
		if (prev && prev.hasBackgroundColor && prev.spaceToTheLeft) {
			const mark = ReactSerializer.getMarks(prevNode).find(
				(m) => m.type.name === 'backgroundColor',
			);
			if (mark) {
				standaloneMarks.push(mark);
			}
		}
	}

	return standaloneMarks;
};
