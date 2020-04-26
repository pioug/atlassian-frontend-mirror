import { insertTypeAheadQuery } from '../../type-ahead/commands/insert-query';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  withAnalytics,
} from '../../analytics';
import { TOOLBAR_MENU_TYPE } from '../../insert-block/ui/ToolbarInsertBlock/types';

export function insertEmojiQuery(inputMethod: TOOLBAR_MENU_TYPE) {
  return withAnalytics({
    action: ACTION.INVOKED,
    actionSubject: ACTION_SUBJECT.TYPEAHEAD,
    actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI,
    attributes: { inputMethod },
    eventType: EVENT_TYPE.UI,
  })(insertTypeAheadQuery(':'));
}
