// import {
//   ACTION,
//   ACTION_SUBJECT,
//   ACTION_SUBJECT_ID,
//   EVENT_TYPE,
// } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { HighlightPluginAction, highlightPluginKey } from '../pm-plugin';

export const changeColor =
  (_editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  ({ color }: { color: string }): EditorCommand =>
  ({ tr }) => {
    tr.setMeta(highlightPluginKey, {
      type: HighlightPluginAction.CHANGE_COLOR,
      color,
    });

    // editorAnalyticsAPI?.attachAnalyticsEvent({
    //   action: ACTION.FORMATTED,
    //   actionSubject: ACTION_SUBJECT.TEXT,
    //   actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
    //   eventType: EVENT_TYPE.TRACK,
    // })(tr);

    return tr;
  };
