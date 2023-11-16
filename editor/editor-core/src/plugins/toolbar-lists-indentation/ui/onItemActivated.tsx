import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

import type { IndentationButtonNode } from '../pm-plugins/indentation-buttons';

import type { ButtonName } from '../types';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type toolbarListsIndentationPlugin from '../index';

export const onItemActivated =
  (
    pluginInjectionApi:
      | ExtractInjectionAPI<typeof toolbarListsIndentationPlugin>
      | undefined,
    indentationStateNode: IndentationButtonNode | undefined,
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
        const node = indentationStateNode;
        if (node === 'paragraph_heading') {
          pluginInjectionApi?.indentation?.actions.indentParagraphOrHeading(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }
        if (node === 'list') {
          pluginInjectionApi?.core.actions.execute(
            pluginInjectionApi?.list.commands.indentList(INPUT_METHOD.TOOLBAR),
          );
        }
        if (node === 'taskList') {
          pluginInjectionApi?.taskDecision?.actions.indentTaskList(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }

        break;
      }
      case 'outdent': {
        const node = indentationStateNode;
        if (node === 'paragraph_heading') {
          pluginInjectionApi?.indentation?.actions.outdentParagraphOrHeading(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }
        if (node === 'list') {
          pluginInjectionApi?.core.actions.execute(
            pluginInjectionApi?.list.commands.outdentList(INPUT_METHOD.TOOLBAR),
          );
        }
        if (node === 'taskList') {
          pluginInjectionApi?.taskDecision?.actions.outdentTaskList(
            INPUT_METHOD.TOOLBAR,
          )(editorView.state, editorView.dispatch);
        }
        break;
      }
    }
  };
