import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { Dispatch } from '../../event-dispatcher';
import type { EditorProps } from '../../types/editor-props';
import type {
  NextEditorPlugin,
  CommandDispatch,
} from '@atlaskit/editor-common/types';
import { submit } from '@atlaskit/editor-common/keymaps';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { stateKey as mediaPluginKey } from '../../plugins/media/pm-plugins/plugin-key';
import { analyticsEventKey } from '../analytics/consts';

export function createPlugin(
  eventDispatch: Dispatch,
  onSave?: (editorView: EditorView) => void,
): SafePlugin | undefined {
  if (!onSave) {
    return;
  }

  return keymap({
    [`${submit.common}`]: (
      state: EditorState,
      _dispatch?: CommandDispatch,
      editorView?: EditorView,
    ) => {
      const mediaState = mediaPluginKey.getState(state);

      if (
        mediaState &&
        mediaState.waitForMediaUpload &&
        !mediaState.allUploadsFinished
      ) {
        return true;
      }

      if (!editorView) {
        return false;
      }

      eventDispatch(analyticsEventKey, analyticsPayload(state));
      onSave(editorView);
      return true;
    },
  }) as SafePlugin;
}

const analyticsPayload = (
  state: EditorState,
): { payload: AnalyticsEventPayload } => ({
  payload: {
    action: ACTION.STOPPED,
    actionSubject: ACTION_SUBJECT.EDITOR,
    actionSubjectId: ACTION_SUBJECT_ID.SAVE,
    attributes: {
      inputMethod: INPUT_METHOD.SHORTCUT,
      documentSize: state.doc.nodeSize,
      // TODO add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks
    },
    eventType: EVENT_TYPE.UI,
  },
});

type Config = EditorProps['onSave'];
const submitEditorPlugin: NextEditorPlugin<
  'submitEditor',
  { pluginConfiguration: Config | undefined }
> = ({ config: onSave }) => ({
  name: 'submitEditor',

  pmPlugins() {
    return [
      {
        name: 'submitEditor',
        plugin: ({ dispatch }) => createPlugin(dispatch, onSave),
      },
    ];
  },
});

export default submitEditorPlugin;
