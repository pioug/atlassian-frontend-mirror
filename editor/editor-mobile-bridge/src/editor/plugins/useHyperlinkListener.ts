import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { HyperlinkState } from '@atlaskit/editor-common/link';
import { toNativeBridge } from '../web-to-native';
import { hasValue } from '../../utils';
import { InsertStatus as HyperlinkInsertStatus } from '@atlaskit/editor-common/link';
import { useListener } from './useListener';

export const useHyperlinkListener = (
  editorView: EditorView,
  hyperlinkState: HyperlinkState | undefined,
) => {
  useListener(
    () => {
      const { activeText, activeLinkMark, canInsertLink } =
        hyperlinkState ?? {};
      const message = {
        text: '',
        url: '',
        top: -1,
        right: -1,
        bottom: -1,
        left: -1,
      };

      if (editorView && activeLinkMark && !!(activeLinkMark as any).node) {
        const coords = editorView.coordsAtPos((activeLinkMark as any).pos);
        message.top = coords.top;
        message.right = coords.right;
        message.bottom = coords.bottom;
        message.left = coords.left;
      }

      if (
        activeLinkMark &&
        activeLinkMark.type === HyperlinkInsertStatus.EDIT_LINK_TOOLBAR
      ) {
        const linkType = activeLinkMark.node.type.schema.marks.link;
        const linkText = activeLinkMark.node.textContent;

        message.text = linkText || '';
        message.url =
          activeLinkMark.node.marks
            .filter((mark) => mark.type === linkType)
            .map((link) => link.attrs.href)
            .pop() || '';
      }

      if (canInsertLink && message.text.length === 0 && hasValue(activeText)) {
        message.text = activeText!;
      }

      toNativeBridge.call('linkBridge', 'currentSelection', message);
    },
    [editorView, hyperlinkState],
    undefined,
  );
};
