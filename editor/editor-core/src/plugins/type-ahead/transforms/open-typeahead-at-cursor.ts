import { Transaction, TextSelection } from 'prosemirror-state';
import { pluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
import type { TypeAheadHandler, TypeAheadInputMethod } from '../types';

type Props = {
  triggerHandler: TypeAheadHandler;
  inputMethod: TypeAheadInputMethod;
  query?: string;
};

export const openTypeAhead = (props: Props) => (tr: Transaction) => {
  const { triggerHandler, inputMethod, query } = props;

  tr.setMeta(pluginKey, {
    action: ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR,
    params: {
      triggerHandler,
      inputMethod,
      query,
    },
  });
};

export const openTypeAheadAtCursor = ({
  triggerHandler,
  inputMethod,
  query,
}: Props) => (tr: Transaction): Transaction | null => {
  openTypeAhead({
    triggerHandler,
    inputMethod,
    query,
  })(tr);

  const { selection } = tr;
  if (!(selection instanceof TextSelection)) {
    return tr;
  }

  if (!selection.$cursor) {
    tr.deleteSelection();
    return tr;
  }

  // Search & Destroy placeholder
  const cursorPos = selection.$cursor.pos;
  const nodeAtCursor = tr.doc.nodeAt(cursorPos);

  const isPlaceholderAtCursorPosition =
    nodeAtCursor && nodeAtCursor.type.name === 'placeholder';

  if (nodeAtCursor && isPlaceholderAtCursorPosition) {
    tr.delete(cursorPos, cursorPos + nodeAtCursor.nodeSize);
  }

  return tr;
};
