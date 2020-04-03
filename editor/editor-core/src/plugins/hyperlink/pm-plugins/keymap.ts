import { keymap } from 'prosemirror-keymap';
import { Plugin, EditorState } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { analyticsService, trackAndInvoke } from '../../../analytics';
import { Match, getLinkMatch } from '../utils';
import { HyperlinkState, stateKey } from '../pm-plugins/main';
import { showLinkToolbar, hideLinkToolbar } from '../commands';
import { queueCards } from '../../card/pm-plugins/actions';
import { Command } from '../../../types';
import { INPUT_METHOD, addAnalytics } from '../../analytics';
import { getLinkCreationAnalyticsEvent } from '../analytics';

export function createKeymapPlugin(): Plugin | undefined {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.addLink.common!,
    trackAndInvoke(
      'atlassian.editor.format.hyperlink.keyboard',
      showLinkToolbar(INPUT_METHOD.SHORTCUT),
    ),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    mayConvertLastWordToHyperlink,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    mayConvertLastWordToHyperlink,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state: EditorState, dispatch, view) => {
      const hyperlinkPlugin = stateKey.getState(state) as HyperlinkState;
      if (hyperlinkPlugin.activeLinkMark) {
        hideLinkToolbar()(state, dispatch);
        if (view) {
          view.focus();
        }
        return false;
      }
      return false;
    },
    list,
  );

  return keymap(list);
}

const mayConvertLastWordToHyperlink: Command = (state, dispatch) => {
  const nodeBefore = state.selection.$from.nodeBefore;
  if (!nodeBefore || !nodeBefore.isText) {
    return false;
  }

  const words = nodeBefore.text!.split(' ');
  const lastWord = words[words.length - 1];
  const match: Match | null = getLinkMatch(lastWord);

  if (match) {
    const hyperlinkedText = match.raw;
    const start = state.selection.$from.pos - hyperlinkedText.length;
    const end = state.selection.$from.pos;

    if (state.doc.rangeHasMark(start, end, state.schema.marks.link)) {
      return false;
    }

    const url = match.url;
    const markType = state.schema.mark('link', { href: url });

    const tr = queueCards([
      {
        url,
        pos: start,
        appearance: 'inline',
        compareLinkText: true,
        source: INPUT_METHOD.AUTO_DETECT,
      },
    ])(state.tr.addMark(start, end, markType));

    analyticsService.trackEvent(
      'atlassian.editor.format.hyperlink.autoformatting',
    );

    if (dispatch) {
      dispatch(
        addAnalytics(
          state,
          tr,
          getLinkCreationAnalyticsEvent(INPUT_METHOD.AUTO_DETECT, url),
        ),
      );
    }
  }
  return false;
};

export default createKeymapPlugin;
