import { Command } from '../../../types';
import { findTypeAheadQuery } from '../utils/find-query-mark';
import { analyticsService } from '../../../analytics';
import { pluginKey } from '../pm-plugins/plugin-key';

export const dismissCommand = (): Command => (state, dispatch) => {
  const queryMark = findTypeAheadQuery(state);

  if (queryMark === null) {
    return false;
  }

  const { start, end } = queryMark;
  const { schema } = state;
  const markType = schema.marks.typeAheadQuery;
  if (start === -1) {
    return false;
  }

  analyticsService.trackEvent('atlassian.editor.typeahead.dismiss');

  const { typeAheadHandler } = pluginKey.getState(state);
  if (typeAheadHandler && typeAheadHandler.dismiss) {
    typeAheadHandler.dismiss(state);
  }

  if (dispatch) {
    dispatch(
      state.tr.removeMark(start, end, markType).removeStoredMark(markType),
    );
  }
  return true;
};
