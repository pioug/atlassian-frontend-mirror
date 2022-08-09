import { EditorView } from 'prosemirror-view';

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

import { ButtonName } from '../types';

export function onItemActivated({
  buttonName,
  editorView,
}: {
  buttonName: ButtonName;
  editorView: EditorView;
}) {
  switch (buttonName) {
    case 'bullet_list':
      toggleBulletList(editorView, INPUT_METHOD.TOOLBAR);

      break;
    case 'ordered_list':
      toggleOrderedList(editorView, INPUT_METHOD.TOOLBAR);

      break;

    case 'indent': {
      const node = indentationButtonsPluginKey.getState(editorView.state).node;
      if (node === 'paragraph_heading') {
        indentParagraphOrHeading(INPUT_METHOD.TOOLBAR)(
          editorView.state,
          editorView.dispatch,
        );
      }
      if (node === 'list') {
        indentList(INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
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
      const node = indentationButtonsPluginKey.getState(editorView.state).node;
      if (node === 'paragraph_heading') {
        outdentParagraphOrHeading(INPUT_METHOD.TOOLBAR)(
          editorView.state,
          editorView.dispatch,
        );
      }
      if (node === 'list') {
        outdentList(INPUT_METHOD.TOOLBAR)(
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
}
