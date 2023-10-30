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
  }: {
    buttonName: ButtonName;
    editorView: EditorView;
  }) => {
    switch (buttonName) {
      case 'bullet_list':
        pluginInjectionApi?.core.actions.execute(
          pluginInjectionApi?.list.commands.toggleBulletList(
            INPUT_METHOD.TOOLBAR,
          ),
        );
        break;
      case 'ordered_list':
        pluginInjectionApi?.core.actions.execute(
          pluginInjectionApi?.list.commands.toggleOrderedList(
            INPUT_METHOD.TOOLBAR,
          ),
        );

        break;

      case 'indent': {
        const node = indentationButtonsPluginKey.getState(
          editorView.state,
        )?.node;
        if (node === 'paragraph_heading') {
          indentParagraphOrHeading(pluginInjectionApi?.analytics?.actions)(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }
        if (node === 'list') {
          pluginInjectionApi?.core.actions.execute(
            pluginInjectionApi?.list.commands.indentList(INPUT_METHOD.TOOLBAR),
          );
        }
        if (node === 'taskList') {
          indentTaskList(pluginInjectionApi?.analytics?.actions)(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }

        break;
      }
      case 'outdent': {
        const node = indentationButtonsPluginKey.getState(
          editorView.state,
        )?.node;
        if (node === 'paragraph_heading') {
          outdentParagraphOrHeading(pluginInjectionApi?.analytics?.actions)(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }
        if (node === 'list') {
          pluginInjectionApi?.core.actions.execute(
            pluginInjectionApi?.list.commands.outdentList(INPUT_METHOD.TOOLBAR),
          );
        }
        if (node === 'taskList') {
          outdentTaskList(pluginInjectionApi?.analytics?.actions)(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }
        break;
      }
    }
  };
