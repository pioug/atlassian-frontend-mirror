import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
  indentList,
  outdentList,
  toggleBulletList,
  toggleOrderedList,
} from '../../list/commands';
import {
  getIndentCommand as indentParagraphOrHeading,
  getOutdentCommand as outdentParagraphOrHeading,
} from '../../indentation/commands';
import {
  getIndentCommand as indentTaskList,
  getUnindentCommand as outdentTaskList,
} from '../../tasks-and-decisions/pm-plugins/keymaps';
import { INPUT_METHOD } from '../../analytics';

import { pluginKey as indentationButtonsPluginKey } from '../pm-plugins/indentation-buttons';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

import type { ButtonName } from '../types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

export const onItemActivated =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  ({
    buttonName,
    editorView,
    featureFlags,
  }: {
    featureFlags: FeatureFlags;
    buttonName: ButtonName;
    editorView: EditorView;
  }) => {
    switch (buttonName) {
      case 'bullet_list':
        toggleBulletList(editorAnalyticsAPI)(editorView, INPUT_METHOD.TOOLBAR);

        break;
      case 'ordered_list':
        toggleOrderedList(editorAnalyticsAPI)(editorView, INPUT_METHOD.TOOLBAR);

        break;

      case 'indent': {
        const node = indentationButtonsPluginKey.getState(
          editorView.state,
        )?.node;
        if (node === 'paragraph_heading') {
          indentParagraphOrHeading(INPUT_METHOD.TOOLBAR)(
            editorView.state,
            editorView.dispatch,
          );
        }
        if (node === 'list') {
          indentList(editorAnalyticsAPI)(INPUT_METHOD.TOOLBAR)(
            editorView.state,
            editorView.dispatch,
          );
        }
        if (node === 'taskList') {
          indentTaskList(INPUT_METHOD.TOOLBAR)(
            editorView.state,
            editorView.dispatch,
          );
        }

        break;
      }
      case 'outdent': {
        const node = indentationButtonsPluginKey.getState(
          editorView.state,
        )?.node;
        if (node === 'paragraph_heading') {
          outdentParagraphOrHeading(INPUT_METHOD.TOOLBAR)(
            editorView.state,
            editorView.dispatch,
          );
        }
        if (node === 'list') {
          outdentList(editorAnalyticsAPI)(INPUT_METHOD.TOOLBAR, featureFlags)(
            editorView.state,
            editorView.dispatch,
          );
        }
        if (node === 'taskList') {
          outdentTaskList(INPUT_METHOD.TOOLBAR)(
            editorView.state,
            editorView.dispatch,
          );
        }
        break;
      }
    }
  };
