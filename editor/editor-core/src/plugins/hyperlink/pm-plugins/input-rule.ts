import { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import { Schema } from 'prosemirror-model';
import { Plugin, EditorState } from 'prosemirror-state';
import { createRule, createPlugin } from '../../../utils/input-rules';
import { Match, LinkMatcher, normalizeUrl } from '../utils';
import { queueCards } from '../../card/pm-plugins/actions';
import { INPUT_METHOD, addAnalytics } from '../../analytics';
import { getLinkCreationAnalyticsEvent } from '../analytics';
import { FeatureFlags } from '../../../types/feature-flags';

export function createLinkInputRule(
  regexp: RegExp,
  skipAnalytics: boolean = false,
  useUnpredictableInputRule: boolean = true,
): InputRuleWrapper {
  // Plain typed text (eg, typing 'www.google.com') should convert to a hyperlink
  return createRule(
    regexp,
    (state: EditorState, match, start: number, end: number) => {
      const { schema } = state;
      if (state.doc.rangeHasMark(start, end, schema.marks.link)) {
        return null;
      }
      const link = (match as unknown) as Match;

      const url = normalizeUrl(link.url);
      const markType = schema.mark('link', { href: url });

      const from = start;
      const to = Math.min(start + link.text.length, state.doc.content.size);

      const tr = queueCards([
        {
          url: link.url,
          pos: from,
          appearance: 'inline',
          compareLinkText: true,
          source: INPUT_METHOD.AUTO_DETECT,
        },
      ])(state.tr.addMark(from, to, markType));

      // Keep old behavior that will delete the space after the link
      if (useUnpredictableInputRule || to === end) {
        tr.insertText(' ');
      }

      if (skipAnalytics) {
        return tr;
      }
      return addAnalytics(
        state,
        tr,
        getLinkCreationAnalyticsEvent(INPUT_METHOD.AUTO_DETECT, url),
      );
    },
  );
}

export function createInputRulePlugin(
  schema: Schema,
  skipAnalytics: boolean = false,
  featureFlags: FeatureFlags,
): Plugin | undefined {
  if (!schema.marks.link) {
    return;
  }

  const hasUseUnpredictableFlag =
    typeof featureFlags.useUnpredictableInputRule === 'boolean';
  const useUnpredictableInputRule = hasUseUnpredictableFlag
    ? Boolean(featureFlags.useUnpredictableInputRule)
    : true;
  const urlWithASpaceRule = createLinkInputRule(
    LinkMatcher.create(useUnpredictableInputRule),
    skipAnalytics,
    featureFlags.useUnpredictableInputRule,
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
      if (skipAnalytics) {
        return tr;
      }
      return addAnalytics(
        state,
        tr,
        getLinkCreationAnalyticsEvent(INPUT_METHOD.FORMATTING, url),
      );
    },
  );

  return createPlugin('hyperlink', [urlWithASpaceRule, markdownLinkRule], {
    useUnpredictableInputRule: featureFlags.useUnpredictableInputRule,
  });
}

export default createInputRulePlugin;
