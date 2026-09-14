import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { getNativeEmbedUrl, isNativeEmbedNode } from './nativeEmbedNode';

export const DISPLAY_AS_OPTIONS = ['url', 'inline', 'block', 'embed'] as const;
export type DisplayAsOption = (typeof DISPLAY_AS_OPTIONS)[number];

export type CardAtPasteRange = {
	appearance: Exclude<DisplayAsOption, 'url'>;
	/**
	 * True when the node is a native embed rather than a card node. It displays as an
	 * embed, but the card commands cannot operate on it — see `nativeEmbedNode.ts`.
	 */
	isNativeEmbed?: boolean;
	pos: number;
};

const cardAtPos = (node: PMNode | null | undefined, pos: number): CardAtPasteRange | undefined => {
	switch (node?.type.name) {
		case 'inlineCard':
			return { appearance: 'inline', pos };
		case 'blockCard':
			return { appearance: 'block', pos };
		case 'embedCard':
			return { appearance: 'embed', pos };
		default:
			return isNativeEmbedNode(node)
				? { appearance: 'embed', isNativeEmbed: true, pos }
				: undefined;
	}
};

const getNodeUrl = (node: PMNode): string | undefined => {
	if (isNativeEmbedNode(node)) {
		return getNativeEmbedUrl(node);
	}
	const attrs = node.attrs as { data?: { url?: unknown }; url?: unknown } | undefined;
	const url = attrs?.url ?? attrs?.data?.url;

	return typeof url === 'string' ? url : undefined;
};

type Candidate = { card: CardAtPasteRange; url: string | undefined };

/**
 * Finds the card that a paste produced.
 *
 * The paste range is recorded when the paste happens and then mapped through every later
 * transaction, so by the time the link has resolved into a card the range can point just
 * past that card. `pastedUrl` resolves the ambiguity: when it is known, a candidate
 * holding that URL wins over one that merely sits in the range, which stops a pre-existing
 * neighbouring card from being reported as the pasted one.
 */
export const getCardAtPasteRange = (
	state: EditorState,
	pasteStartPos: number,
	pasteEndPos: number,
	pastedUrl?: string,
): CardAtPasteRange | undefined => {
	const docContentSize = state.doc.content.size;
	const clampedStart = Math.max(0, Math.min(pasteStartPos, docContentSize));
	const clampedEnd = Math.max(0, Math.min(pasteEndPos, docContentSize));
	const from = Math.min(clampedStart, clampedEnd);
	const to = Math.max(clampedStart, clampedEnd);
	try {
		const candidateAt = (pos: number): Candidate | undefined => {
			if (pos < 0 || pos >= docContentSize) {
				return undefined;
			}
			const node = state.doc.nodeAt(pos);
			const card = cardAtPos(node, pos);

			return node && card ? { card, url: getNodeUrl(node) } : undefined;
		};

		const adjacent = [candidateAt(from - 1), candidateAt(from)].filter(
			(candidate): candidate is Candidate => Boolean(candidate),
		);
		const inRange: Candidate[] = [];
		state.doc.nodesBetween(from, to, (node, pos) => {
			const card = cardAtPos(node, pos);
			if (card) {
				inRange.push({ card, url: getNodeUrl(node) });
				return false;
			}
			return true;
		});

		if (pastedUrl) {
			const match = [...adjacent, ...inRange].find((candidate) => candidate.url === pastedUrl);
			if (match) {
				return match.card;
			}
		}

		if (from === to) {
			const [firstAdjacent] = adjacent;
			if (firstAdjacent) {
				return firstAdjacent.card;
			}
		}

		return inRange[inRange.length - 1]?.card;
	} catch {
		return undefined;
	}
};
