import type { Match } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { InputRuleWrapper } from '@atlaskit/editor-common/types';
import {
	createRule,
	findFilepaths,
	getLinkCreationAnalyticsEvent,
	isLinkInMatches,
	LinkMatcher,
	normalizeUrl,
	shouldAutoLinkifyMatch,
} from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { createPlugin } from '@atlaskit/prosemirror-input-rules';

import { toolbarKey } from './toolbar-buttons';

/**
 * Called when space after link, but not on enter
 */
export function createLinkInputRule(
	regexp: RegExp,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): InputRuleWrapper {
	// Plain typed text (eg, typing 'www.google.com') should convert to a hyperlink
	return createRule(regexp, (state: EditorState, match, start: number, end: number) => {
		const { schema } = state;
		if (state.doc.rangeHasMark(start, end, schema.marks.link)) {
			return null;
		}
		const link = match as unknown as Match;

		// Property 'url' does not exist on type 'RegExpExecArray', the type of `match`.
		// This check is in case the match is not a Linkify match, which has a url property.
		if (link.url === undefined) {
			return null;
		}

		if (!shouldAutoLinkifyMatch(link)) {
			return null;
		}

		const url: string = normalizeUrl(link.url);

		// Not previously handled; don't create a link if the URL is empty.
		// This will only happen if the `regexp` matches more links than the normalizeUrl validation;
		// if they both use the same linkify instance this shouldn't happen.
		if (url === '') {
			return null;
		}
		const markType = schema.mark('link', { href: url });

		// Need access to complete text to check if last URL is part of a filepath before linkifying
		const nodeBefore = state.selection.$from.nodeBefore;
		if (!nodeBefore || !nodeBefore.isText || !nodeBefore.text) {
			return null;
		}
		const filepaths = findFilepaths(
			nodeBefore.text,
			// The position referenced by 'start' is relative to the start of the document, findFilepaths deals with index in a node only.
			start - (nodeBefore.text.length - link.text.length), // (start of link match) - (whole node text length - link length) gets start of text node, which is used as offset
		);
		if (isLinkInMatches(start, filepaths)) {
			const tr = state.tr;
			return tr;
		}

		const from = start;
		const to = Math.min(start + link.text.length, state.doc.content.size);

		const tr = state.tr.addMark(from, to, markType);

		// Keep old behavior that will delete the space after the link
		if (to === end) {
			tr.insertText(' ');
		}

		addLinkMetadata(state.selection, tr, {
			inputMethod: INPUT_METHOD.AUTO_DETECT,
		});

		const skipAnalytics = toolbarKey.getState(state)?.skipAnalytics ?? false;
		if (skipAnalytics) {
			return tr;
		}
		editorAnalyticsApi?.attachAnalyticsEvent(
			getLinkCreationAnalyticsEvent(INPUT_METHOD.AUTO_DETECT, url),
		)(tr);
		return tr;
	});
}

export function createInputRulePlugin(
	schema: Schema,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	autoLinkOnBlur: boolean = false,
): SafePlugin | undefined {
	if (!schema.marks.link) {
		return;
	}

	const urlWithASpaceRule = createLinkInputRule(LinkMatcher.create(), editorAnalyticsApi);

	// [something](link) should convert to a hyperlink
	// eslint-disable-next-line require-unicode-regexp
	const markdownLinkRule = createRule(/(^|[^!])\[(.*?)\]\((\S+)\)$/, (state, match, start, end) => {
		const { schema } = state;
		const [, prefix, linkText, linkUrl] = match;

		// We don't filter this match here by shouldAutoLinkifyMatch
		// because the intent of creating a link is clear

		const url = normalizeUrl(linkUrl).trim();
		const markType = schema.mark('link', { href: url });

		const tr = state.tr.replaceWith(
			start + prefix.length,
			end,
			schema.text((linkText || '').trim(), [markType]),
		);

		addLinkMetadata(state.selection, tr, {
			inputMethod: INPUT_METHOD.FORMATTING,
		});

		const skipAnalytics = toolbarKey.getState(state)?.skipAnalytics ?? false;

		if (skipAnalytics) {
			return tr;
		}
		editorAnalyticsApi?.attachAnalyticsEvent(
			getLinkCreationAnalyticsEvent(INPUT_METHOD.FORMATTING, url),
		)(tr);

		return tr;
	});

	return new SafePlugin(
		createPlugin(
			'hyperlink',
			[urlWithASpaceRule, markdownLinkRule],
			autoLinkOnBlur
				? {
						checkOnBlur: true,
						appendTextOnBlur: ' ',
					}
				: undefined,
		),
	);
}

export default createInputRulePlugin;
