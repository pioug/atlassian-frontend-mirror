import { EditorView } from 'prosemirror-view';

import { toggleBulletList, toggleOrderedList } from '../../list/commands';
import { INPUT_METHOD } from '../../analytics';

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
    case 'indent':
      editorView.someProp('handleKeyDown', (handleKeyDown) =>
        handleKeyDown(
          editorView,
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Tab',
            code: 'Tab',
          }),
        ),
      );

      break;
    case 'outdent':
      editorView.someProp('handleKeyDown', (handleKeyDown) =>
        handleKeyDown(
          editorView,
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            shiftKey: true,
            key: 'Tab',
            code: 'Tab',
          }),
        ),
      );

      break;
  }
}
