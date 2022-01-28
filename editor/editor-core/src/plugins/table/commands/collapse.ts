import { Command } from '../../../types';
import { collapseSelectedTable } from '../utils/collapse';

export const wrapTableInExpand: Command = (state, dispatch) => {
  const collapseTr = collapseSelectedTable(state.tr);

  if (!collapseTr) {
    return false;
  }

  if (dispatch) {
    dispatch(collapseTr);
  }

  return true;
};
