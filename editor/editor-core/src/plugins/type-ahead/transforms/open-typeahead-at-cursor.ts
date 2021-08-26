import { Transaction, TextSelection } from 'prosemirror-state';
import { pluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
import type { TypeAheadHandler, TypeAheadInputMethod } from '../types';

type Props = {
  triggerHandler: TypeAheadHandler;
  inputMethod: TypeAheadInputMethod;
  query?: string;
};
export const openTypeAheadAtCursor = ({
  triggerHandler,
  inputMethod,
  query,
}: Props) => (tr: Transaction): Transaction | null => {
  tr.setMeta(pluginKey, {
    action: ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR,
    params: {
      triggerHandler,
      inputMethod,
      query,
    },
  });

  const { selection } = tr;
  const isTextRangeSelection =
    selection instanceof TextSelection && selection.$cursor === null;
  const nextTr = isTextRangeSelection ? tr.deleteSelection() : tr;
  return nextTr;
};
