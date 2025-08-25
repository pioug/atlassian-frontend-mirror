// File has been copied to packages/editor/editor-plugin-ai/src/provider/markdown-transformer/utils/hyperlink.ts
// If changes are made to this file, please make the same update in the linked file.

import type { Match } from '@atlaskit/adf-schema';
import { isSafeUrl, linkify, normalizeUrl as normaliseLinkHref } from '@atlaskit/adf-schema';
import type { Node, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics/types/enums';
import type { AnalyticsEventPayload } from '../analytics/types/events';
import type { InputMethodInsertLink } from '../analytics/types/insert-events';

import { shouldAutoLinkifyMatch } from './should-auto-linkify-tld';
import { mapSlice } from './slice';

// Regular expression for a windows filepath in the format <DRIVE LETTER>:\<folder name>\
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
export const FILEPATH_REGEXP = /([a-zA-Z]:|\\)([^\/:*?<>"|]+\\)?([^\/:*?<>"| ]+(?=\s?))?/gim;

// Don't linkify if starts with $ or {
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
export const DONTLINKIFY_REGEXP = /^(\$|{)/;

/**
 * Instance of class LinkMatcher are used in autoformatting in place of Regex.
 * Hence it has been made similar to regex with an exec method.
 * Extending it directly from class Regex was introducing some issues, thus that has been avoided.
 */
export class LinkMatcher {
	static create(): RegExp {
		class LinkMatcherRegex {
			exec(str: string): Match | null {
				const stringsBySpace = str.slice(0, str.length - 1).split(' ');
				const lastStringBeforeSpace = stringsBySpace[stringsBySpace.length - 1];
				const isLastStringValid = lastStringBeforeSpace.length > 0;

				if (!str.endsWith(' ') || !isLastStringValid) {
					return null;
				}

				if (DONTLINKIFY_REGEXP.test(lastStringBeforeSpace)) {
					return null;
				}

				const links: null | Match[] = linkify.match(lastStringBeforeSpace);
				if (!links || links.length === 0) {
					return null;
				}
				const lastMatch = links[links.length - 1];
				const lastLink: Match = links[links.length - 1];

				lastLink.input = str.substring(lastMatch.index);
				lastLink.length = lastLink.lastIndex - lastLink.index + 1;
				lastLink.index = str.lastIndexOf(lastStringBeforeSpace) + lastMatch.index;

				return lastLink;
			}
		}

		return new LinkMatcherRegex() as RegExp;
	}
}

/**
 * Adds protocol to url if needed.
 */
export function normalizeUrl(url?: string | null) {
	if (!url) {
		return '';
	}

	if (isSafeUrl(url)) {
		return url;
	}
	return normaliseLinkHref(url);
}

/**
 * Linkify content in a slice (eg. after a rich text paste)
 */
export function linkifyContent(schema: Schema): (slice: Slice) => Slice {
	return (slice: Slice): Slice =>
		mapSlice(slice, (node, parent) => {
			const isAllowedInParent = !parent || parent.type !== schema.nodes.codeBlock;
			const link = node.type.schema.marks.link;
			if (link === undefined) {
				throw new Error('Link not in schema - unable to linkify content');
			}
			if (isAllowedInParent && node.isText && !link.isInSet(node.marks)) {
				const linkified = [] as Node[];
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const text = node.text!;

				const matches = findLinkMatches(text).filter(shouldAutoLinkifyMatch);

				let pos = 0;
				const filepaths = findFilepaths(text);
				matches.forEach((match) => {
					if (isLinkInMatches(match.index, filepaths)) {
						return;
					}

					if (match.index > 0) {
						linkified.push(node.cut(pos, match.index));
					}
					linkified.push(
						node
							.cut(match.index, match.lastIndex)
							.mark(link.create({ href: normalizeUrl(match.url) }).addToSet(node.marks)),
					);
					pos = match.lastIndex;
				});
				if (pos < text.length) {
					linkified.push(node.cut(pos));
				}
				return linkified;
			}
			return node;
		});
}

export function getLinkDomain(url: string): string {
	// Remove protocol and www., if either exists
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const withoutProtocol = url.toLowerCase().replace(/^(.*):\/\//, '');
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const withoutWWW = withoutProtocol.replace(/^(www\.)/, '');

	// Remove port, fragment, path, query string
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return withoutWWW.replace(/[:\/?#](.*)$/, '');
}

export function isFromCurrentDomain(url: string): boolean {
	if (!window || !window.location) {
		return false;
	}
	const currentDomain = window.location.hostname;
	const linkDomain = getLinkDomain(url);
	return currentDomain === linkDomain;
}

/**
 * Fetch linkify matches from text
 * @param text Input text from a node
 * @returns Array of linkify matches. Returns empty array if text is empty or no matches found;
 */
function findLinkMatches(text: string): Match[] {
	if (text === '') {
		return [];
	}
	return linkify.match(text) || [];
}

interface filepathMatch {
	endIndex: number;
	startIndex: number;
}

export const findFilepaths = (text: string, offset: number = 0): Array<filepathMatch> => {
	// Creation of a copy of the RegExp is necessary as lastIndex is stored on it when we run .exec()
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const localRegExp = new RegExp(FILEPATH_REGEXP);
	let match;
	const matchesList = [];
	const maxFilepathSize = 260;
	// Ignored via go/ees005
	// eslint-disable-next-line no-cond-assign
	while ((match = localRegExp.exec(text)) !== null) {
		const start = match.index + offset;
		let end = localRegExp.lastIndex + offset;
		if (end - start > maxFilepathSize) {
			end = start + maxFilepathSize;
		} // We don't care about big strings of text that are pretending to be filepaths!!
		matchesList.push({
			startIndex: start,
			endIndex: end,
		});
	}
	return matchesList;
};

export const isLinkInMatches = (linkStart: number, matchesList: Array<filepathMatch>): boolean => {
	for (let i = 0; i < matchesList.length; i++) {
		if (linkStart >= matchesList[i].startIndex && linkStart < matchesList[i].endIndex) {
			return true;
		}
	}
	return false;
};

export function getLinkCreationAnalyticsEvent(
	inputMethod: InputMethodInsertLink,
	url: string,
): AnalyticsEventPayload {
	return {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.LINK,
		attributes: { inputMethod, fromCurrentDomain: isFromCurrentDomain(url) },
		eventType: EVENT_TYPE.TRACK,
		nonPrivacySafeAttributes: {
			linkDomain: getLinkDomain(url),
		},
	};
}

export const canLinkBeCreatedInRange = (from: number, to: number) => (state: EditorState) => {
	if (!state.doc.rangeHasMark(from, to, state.schema.marks.link)) {
		const $from = state.doc.resolve(from);
		const $to = state.doc.resolve(to);
		const link = state.schema.marks.link;

		if ($from.parent === $to.parent && $from.parent.isTextblock) {
			if ($from.parent.type.allowsMarkType(link)) {
				let allowed = true;
				state.doc.nodesBetween(from, to, (node) => {
					const hasInlineCard = node.type === state.schema.nodes.inlineCard;

					allowed = allowed && !node.marks.some((m) => m.type.excludes(link)) && !hasInlineCard;
					return allowed;
				});
				return allowed;
			}
		}
	}
	return false;
};
