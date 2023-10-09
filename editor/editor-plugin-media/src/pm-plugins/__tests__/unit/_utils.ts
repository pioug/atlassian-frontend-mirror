import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

export const sendArrowLeftKey = (
  editorView: EditorView,
  { numTimes = 1 }: { numTimes?: number } = {},
) => {
  for (let i = 0; i < numTimes; i++) {
    sendKeyToPm(editorView, 'ArrowLeft');
  }
};

export const sendArrowRightKey = (
  editorView: EditorView,
  { numTimes = 1 }: { numTimes?: number } = {},
) => {
  for (let i = 0; i < numTimes; i++) {
    sendKeyToPm(editorView, 'ArrowRight');
  }
};
