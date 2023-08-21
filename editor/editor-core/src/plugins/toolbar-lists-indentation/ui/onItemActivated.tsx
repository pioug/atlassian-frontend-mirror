import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type toolbarListsIndentationPlugin from '../index';

export const onItemActivated =
  (
    pluginInjectionApi:
      | ExtractInjectionAPI<typeof toolbarListsIndentationPlugin>
      | undefined,
  ) =>
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
        pluginInjectionApi?.dependencies.list.actions.toggleBulletList(
          editorView,
          INPUT_METHOD.TOOLBAR,
        );

        break;
      case 'ordered_list':
        pluginInjectionApi?.dependencies.list.actions.toggleOrderedList(
          editorView,
          INPUT_METHOD.TOOLBAR,
        );

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
          pluginInjectionApi?.dependencies.list.actions.indentList(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
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
          pluginInjectionApi?.dependencies.list.actions.outdentList(
            INPUT_METHOD.TOOLBAR,
            featureFlags,
          )(editorView.state, editorView.dispatch);
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
