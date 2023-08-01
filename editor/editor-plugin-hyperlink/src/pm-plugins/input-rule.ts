import type { Match } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import {
  findFilepaths,
  getLinkCreationAnalyticsEvent,
  isLinkInMatches,
  LinkMatcher,
  normalizeUrl,
} from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import { createPlugin, createRule } from '@atlaskit/prosemirror-input-rules';

export function createLinkInputRule(
  regexp: RegExp,
  skipAnalytics: boolean = false,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): InputRuleWrapper {
  // Plain typed text (eg, typing 'www.google.com') should convert to a hyperlink
  return createRule(
    regexp,
    (state: EditorState, match, start: number, end: number) => {
      const { schema } = state;
      if (state.doc.rangeHasMark(start, end, schema.marks.link)) {
        return null;
      }
      const link = match as unknown as Match;
      const url = normalizeUrl(link.url);
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

      if (skipAnalytics) {
        return tr;
      }
      editorAnalyticsApi?.attachAnalyticsEvent(
        getLinkCreationAnalyticsEvent(INPUT_METHOD.AUTO_DETECT, url),
      )(tr);
      return tr;
    },
  );
}

export function createInputRulePlugin(
  schema: Schema,
  skipAnalytics: boolean = false,
  featureFlags: FeatureFlags,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
  if (!schema.marks.link) {
    return;
  }

  const urlWithASpaceRule = createLinkInputRule(
    LinkMatcher.create(),
    skipAnalytics,
    editorAnalyticsApi,
  );

  // [something](link) should convert to a hyperlink
  const markdownLinkRule = createRule(
    /(^|[^!])\[(.*?)\]\((\S+)\)$/,
    (state, match, start, end) => {
      const { schema } = state;
      const [, prefix, linkText, linkUrl] = match;
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

      if (skipAnalytics) {
        return tr;
      }
      editorAnalyticsApi?.attachAnalyticsEvent(
        getLinkCreationAnalyticsEvent(INPUT_METHOD.FORMATTING, url),
      )(tr);

      return tr;
    },
  );

  return createPlugin('hyperlink', [urlWithASpaceRule, markdownLinkRule]);
}

export default createInputRulePlugin;
