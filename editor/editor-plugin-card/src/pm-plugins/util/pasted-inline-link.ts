import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { PastedInlineLink } from '../../types';

/** Bounds the per-editor work; the first pasted links win. */
export const MAX_PASTED_INLINE_LINKS = 10;

const isSameLink = (a: PastedInlineLink, b: PastedInlineLink): boolean =>
	a.pos === b.pos && a.url === b.url;

/**
 * Map candidates through a transaction. Anything that was deleted, replaced by another node or
 * given a different URL stops being a candidate. Returns the same array when nothing changed.
 */
export const mapPastedInlineLinks = (
	links: PastedInlineLink[],
	tr: ReadonlyTransaction | Transaction,
): PastedInlineLink[] => {
	if (tr.getMeta('replaceDocument')) {
		return links.length ? [] : links;
	}
	if (!tr.docChanged || !links.length) {
		return links;
	}
	let changed = false;
	const mapped: PastedInlineLink[] = [];
	for (const link of links) {
		const result = tr.mapping.mapResult(link.pos, 1);
		const node = result.deleted ? null : tr.doc.nodeAt(result.pos);
		if (node?.type.name !== 'inlineCard' || node.attrs.url !== link.url) {
			changed = true;
			continue;
		}
		if (result.pos !== link.pos) {
			changed = true;
			mapped.push({ pos: result.pos, url: link.url });
		} else {
			mapped.push(link);
		}
	}
	return changed ? mapped : links;
};

/** Append new candidates, skipping duplicates and anything beyond the cap. */
export const addPastedInlineLinks = (
	links: PastedInlineLink[],
	additions: PastedInlineLink[],
): PastedInlineLink[] => {
	let next = links;
	for (const addition of additions) {
		if (next.length >= MAX_PASTED_INLINE_LINKS) {
			break;
		}
		if (!next.some((link) => isSameLink(link, addition))) {
			next = [...next, addition];
		}
	}
	return next;
};

export const removePastedInlineLink = (
	links: PastedInlineLink[],
	target: PastedInlineLink,
): PastedInlineLink[] => {
	const next = links.filter((link) => !isSameLink(link, target));
	return next.length === links.length ? links : next;
};

/** Inline cards inserted by a paste transaction (copy and paste of existing cards). */
export const getPastedInlineCards = (tr: ReadonlyTransaction | Transaction): PastedInlineLink[] => {
	if (!tr.docChanged || tr.getMeta('uiEvent') !== 'paste' || tr.getMeta('isRemote')) {
		return [];
	}
	const found: PastedInlineLink[] = [];
	tr.mapping.maps.forEach((stepMap, index) => {
		const later = tr.mapping.slice(index + 1);
		stepMap.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
			tr.doc.nodesBetween(later.map(newStart, -1), later.map(newEnd, 1), (node: PMNode, pos) => {
				if (node.type.name === 'inlineCard' && typeof node.attrs.url === 'string') {
					found.push({ pos, url: node.attrs.url });
				}
			});
		});
	});
	return found;
};

/** Inline cards created from clipboard URLs that just resolved in this transaction. */
export const getResolvedPastedInlineCards = (
	tr: ReadonlyTransaction | Transaction,
	requests: Array<{ appearance?: string; pos: number; source?: string; url: string }>,
	resolvedUrl: string,
	clipboardSource: string,
): PastedInlineLink[] => {
	if (tr.getMeta('isRemote')) {
		return [];
	}
	const found: PastedInlineLink[] = [];
	for (const request of requests) {
		if (
			request.url !== resolvedUrl ||
			request.appearance !== 'inline' ||
			request.source !== clipboardSource
		) {
			continue;
		}
		const pos = tr.mapping.map(request.pos, -1);
		if (pos < 0 || pos >= tr.doc.content.size) {
			continue;
		}
		const node = tr.doc.nodeAt(pos);
		if (node?.type.name === 'inlineCard' && node.attrs.url === request.url) {
			found.push({ pos, url: request.url });
		}
	}
	return found;
};

type PastedInlineLinkState = {
	pastedInlineLinks?: PastedInlineLink[];
	pastedInlineLinkShown?: boolean;
};

/** Add candidates unless tracking is off or a link has already been displayed. */
export const withPastedInlineLinks = <State extends PastedInlineLinkState>(
	state: State,
	additions: PastedInlineLink[],
): State => {
	if (!state.pastedInlineLinks || state.pastedInlineLinkShown || !additions.length) {
		return state;
	}
	const next = addPastedInlineLinks(state.pastedInlineLinks, additions);
	return next === state.pastedInlineLinks ? state : { ...state, pastedInlineLinks: next };
};
