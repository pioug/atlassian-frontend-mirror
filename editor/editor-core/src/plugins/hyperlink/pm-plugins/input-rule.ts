import { InputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { Plugin, EditorState } from 'prosemirror-state';
import {
  createInputRule,
  instrumentedInputRule,
} from '../../../utils/input-rules';
import { Match, LinkMatcher, normalizeUrl } from '../utils';
import { queueCards } from '../../card/pm-plugins/actions';
import { INPUT_METHOD, addAnalytics } from '../../analytics';
import { getLinkCreationAnalyticsEvent } from '../analytics';

export function createLinkInputRule(regexp: RegExp): InputRule {
  // Plain typed text (eg, typing 'www.google.com') should convert to a hyperlink
  return createInputRule(
    regexp,
    (state: EditorState, match, start: number, end: number) => {
      const { schema } = state;
      if (state.doc.rangeHasMark(start, end, schema.marks.link)) {
        return null;
      }
      const [link] = (match as any) as Match[];

      const url = normalizeUrl(link.url);
      const markType = schema.mark('link', { href: url });

      const tr = queueCards([
        {
          url: link.url,
          pos: start - (link.input!.length - link.lastIndex),
          appearance: 'inline',
          compareLinkText: true,
          source: INPUT_METHOD.AUTO_DETECT,
        },
      ])(
        state.tr
          .addMark(
            start - (link.input!.length - link.lastIndex),
            end - (link.input!.length - link.lastIndex),
            markType,
          )
          .insertText(' '),
      );
      return addAnalytics(
        state,
        tr,
        getLinkCreationAnalyticsEvent(INPUT_METHOD.AUTO_DETECT, url),
      );
    },
  );
}

export function createInputRulePlugin(schema: Schema): Plugin | undefined {
  if (!schema.marks.link) {
    return;
  }

  const urlWithASpaceRule = createLinkInputRule(new LinkMatcher() as RegExp);

  // [something](link) should convert to a hyperlink
  const markdownLinkRule = createInputRule(
    /(^|[^!])\[(.*?)\]\((\S+)\)$/,
    (state, match, start, end) => {
      const { schema } = state;
      const [, prefix, linkText, linkUrl] = match;
      const url = normalizeUrl(linkUrl);
      const markType = schema.mark('link', { href: url });

      const tr = state.tr.replaceWith(
        start + prefix.length,
        end,
        schema.text(linkText, [markType]),
      );
      return addAnalytics(
        state,
        tr,
        getLinkCreationAnalyticsEvent(INPUT_METHOD.FORMATTING, url),
      );
    },
  );

  return instrumentedInputRule('hyperlink', {
    rules: [urlWithASpaceRule, markdownLinkRule],
  });
}

export default createInputRulePlugin;
