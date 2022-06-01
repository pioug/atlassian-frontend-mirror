/**
 * Fix an issue that composition text replacement in Safari removes empty nodes during text composition text deletion.
 * https://github.com/ProseMirror/prosemirror/issues/934
 * We will remove this plugin when Webkit fix the problem itself.
 */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

interface SafariDeleteCompositionTextIssueWorkaroundPluginState {
  renderSpan: boolean;
  decorations: DecorationSet;
}

export const tableSafariDeleteCompositionTextIssueWorkaroundKey = new PluginKey<
  SafariDeleteCompositionTextIssueWorkaroundPluginState
>('tableSafariDeleteCompositionTextIssueWorkaround');

export const createPlugin = () => {
  return new SafePlugin<SafariDeleteCompositionTextIssueWorkaroundPluginState>({
    key: tableSafariDeleteCompositionTextIssueWorkaroundKey,
    state: {
      init: (): SafariDeleteCompositionTextIssueWorkaroundPluginState => ({
        renderSpan: false,
        decorations: DecorationSet.empty,
      }),
      apply: (
        tr,
        value,
      ): SafariDeleteCompositionTextIssueWorkaroundPluginState => {
        const renderSpan: boolean = tr.getMeta(
          tableSafariDeleteCompositionTextIssueWorkaroundKey,
        );
        if (typeof renderSpan === 'undefined') {
          return value;
        }

        let decorations;
        if (renderSpan) {
          // Find position of the first text node in case it has multiple text nodes created by Japanese IME
          const { $from } = tr.selection;
          const pos = $from.before($from.depth);
          const spanDecoration = Decoration.widget(pos, () => {
            const spanElement = document.createElement('span');
            return spanElement;
          });
          decorations = DecorationSet.create(tr.doc, [spanDecoration]);
        } else {
          decorations = DecorationSet.empty;
        }

        return {
          renderSpan,
          decorations,
        };
      },
    },
    props: {
      decorations: (state) =>
        tableSafariDeleteCompositionTextIssueWorkaroundKey.getState(state)
          .decorations,
      handleDOMEvents: {
        beforeinput: (view: EditorView, event: Event): boolean => {
          if ((event as InputEvent)?.inputType !== 'deleteCompositionText') {
            return false;
          }
          const selection = window.getSelection();
          if (
            !selection ||
            selection.rangeCount <= 0 ||
            selection.type !== 'Range'
          ) {
            return false;
          }
          const range = selection.getRangeAt(0);
          const {
            startContainer,
            endContainer,
            endOffset,
            startOffset,
          } = range;
          /**
           * On Safari when composition text is deleted, it deletes any empty elements it finds up the dom tree. Prosemirror can sometimes be confused by this
           * and will think that we meant to delete those elements. This fix forces the resulting node to not be empty.
           * The condition here checks to see if the entire text node is about to be swapped inside of an element
           */
          if (
            startContainer.nodeType === Node.TEXT_NODE &&
            startContainer === endContainer &&
            startOffset === 0 &&
            endOffset === (startContainer as Text).length
          ) {
            const { tr } = view.state;
            tr.setMeta(
              tableSafariDeleteCompositionTextIssueWorkaroundKey,
              true,
            );
            view.dispatch(tr);
          }
          return false;
        },
        input: (view: EditorView, event: Event): boolean => {
          if ((event as InputEvent)?.inputType !== 'deleteCompositionText') {
            return false;
          }
          const selection = window.getSelection();
          if (!selection) {
            return false;
          }
          const { tr } = view.state;
          tr.setMeta(tableSafariDeleteCompositionTextIssueWorkaroundKey, false);
          view.dispatch(tr);
          return false;
        },
      },
    },
  });
};
