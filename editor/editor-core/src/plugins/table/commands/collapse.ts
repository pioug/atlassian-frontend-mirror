import { Command } from '../../../types';
import { collapseSelectedTable } from '../utils/collapse';

export const wrapTableInExpand: Command = (state, dispatch) => {
  const canCollapseTr = collapseSelectedTable(state.tr);

  if (!canCollapseTr) {
    return false;
  }

  if (dispatch) {
    dispatch(canCollapseTr);
  }

  return true;
};
