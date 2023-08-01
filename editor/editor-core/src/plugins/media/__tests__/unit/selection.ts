import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { EditorInstanceWithPlugin } from '@atlaskit/editor-test-helpers/create-editor';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { RefsNode } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  p,
  media,
  mediaSingle,
  mediaGroup,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { Schema } from '@atlaskit/editor-test-helpers/schema';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { setNodeSelection } from '@atlaskit/editor-common/utils';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import { setGapCursorAtPos } from '../../../selection/gap-cursor/actions';

describe('media selection', () => {
  let editor: (
    doc: (schema: Schema<any, any>) => RefsNode,
  ) => EditorInstanceWithPlugin<any>;

  beforeEach(() => {
    const createEditor = createEditorFactory();
    editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
      createEditor({
        doc,
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      });
  });

  describe('select media node inside mediaSingle', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    beforeEach(() => {
      // paragraph 1-2
      // mediaSingle 3-5
      // media 4-4
      editorInstance = editor(
        doc(
          p('{<>}'),
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
          p('text{<>}'),
        ),
      );
    });

    it('not change selection when select mediaSingle', () => {
      const editorView = editorInstance.editorView;
      const { state } = editorView;
      const cursorPos = 2;

      editorView.dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(cursorPos))),
      );

      expect(editorView.state.selection instanceof NodeSelection).toBe(true);

      expect(
        (editorView.state.selection as NodeSelection).node.type.name,
      ).toEqual('mediaSingle');
      expect(editorView.state.selection.$from.pos).toBe(2);
      expect(editorView.state.selection.$to.pos).toBe(5);
    });

    it('change selection when select media', () => {
      const editorView = editorInstance.editorView;
      const { state } = editorView;
      const cursorPos = 3;

      editorView.dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(cursorPos))),
      );

      expect(editorView.state.selection instanceof NodeSelection).toBe(true);

      expect(
        (editorView.state.selection as NodeSelection).node.type.name,
      ).toEqual('mediaSingle');
      expect(editorView.state.selection.$from.pos).toBe(2);
      expect(editorView.state.selection.$to.pos).toBe(5);
    });
  });

  describe('select media node inside mediaGroup', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    beforeEach(() => {
      editorInstance = editor(
        doc(
          mediaGroup(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
          p('text{<>}'),
        ),
      );
    });

    it('change selection when select media', () => {
      const editorView = editorInstance.editorView;
      const { state } = editorView;
      const cursorPos = 1;

      editorView.dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(cursorPos))),
      );

      expect(editorView.state.selection instanceof NodeSelection).toBe(true);

      expect(editorView.state.selection.$from.pos).toBe(cursorPos);
    });
  });

  describe('arrow down from media group to media single', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    beforeEach(() => {
      editorInstance = editor(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media2',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media3',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
          ),
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'boop',
            })(),
          ),
        ),
      );
    });

    it('should select media single below', () => {
      const editorView = editorInstance.editorView;
      const positionOfLastMediaNodeInGroup = 3;
      setNodeSelection(editorView, positionOfLastMediaNodeInGroup);
      sendKeyToPm(editorView, 'ArrowDown');
      expect(editorView.state.selection instanceof NodeSelection).toBe(true);
      expect((editorView.state.selection as NodeSelection).node.type.name).toBe(
        'mediaSingle',
      );
    });
  });

  describe('arrow up from media single', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to gap cursor if media single is first node in the doc', () => {
      editorInstance = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'boop',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      const positionOfMediaSingle = 1;
      setNodeSelection(editorView, positionOfMediaSingle);
      sendKeyToPm(editorView, 'ArrowUp');
      expect(editorView.state.selection instanceof GapCursorSelection).toBe(
        true,
      );
      expect(editorView.state.selection.from).toBe(0);
    });

    describe('and the node before is mediaGroup', () => {
      it('should move selection to the gap cursor before if the selected node', () => {
        editorInstance = editor(
          doc(
            mediaGroup(
              media({
                id: 'media1',
                type: 'file',
                collection: 'MediaServicesSample',
                __fileMimeType: 'pdf',
              })(),
              media({
                id: 'media2',
                type: 'file',
                collection: 'MediaServicesSample',
                __fileMimeType: 'pdf',
              })(),
              media({
                id: 'media3',
                type: 'file',
                collection: 'MediaServicesSample',
                __fileMimeType: 'pdf',
              })(),
            ),
            mediaSingle()(
              media({
                id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                type: 'file',
                collection: 'boop',
              })(),
            ),
          ),
        );
        const editorView = editorInstance.editorView;
        const positionOfMediaSingle = 5;
        setNodeSelection(editorView, positionOfMediaSingle);
        sendKeyToPm(editorView, 'ArrowUp');
        expect(editorView.state.selection instanceof GapCursorSelection).toBe(
          true,
        );
        expect(editorView.state.selection.from).toBe(5);
      });

      it('should move selection to the gap cursor before the mediaGroup on second up arrow', () => {
        editorInstance = editor(
          doc(
            mediaGroup(
              media({
                id: 'media1',
                type: 'file',
                collection: 'MediaServicesSample',
                __fileMimeType: 'pdf',
              })(),
              media({
                id: 'media2',
                type: 'file',
                collection: 'MediaServicesSample',
                __fileMimeType: 'pdf',
              })(),
              media({
                id: 'media3',
                type: 'file',
                collection: 'MediaServicesSample',
                __fileMimeType: 'pdf',
              })(),
            ),
            mediaSingle()(
              media({
                id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                type: 'file',
                collection: 'boop',
              })(),
            ),
          ),
        );
        const editorView = editorInstance.editorView;
        const positionOfMediaSingle = 5;
        setNodeSelection(editorView, positionOfMediaSingle);
        sendKeyToPm(editorView, 'ArrowUp');
        sendKeyToPm(editorView, 'ArrowUp');
        expect(editorView.state.selection instanceof GapCursorSelection).toBe(
          true,
        );
        expect(editorView.state.selection.from).toBe(0);
      });
    });
  });

  describe('arrow up from mediaGroup', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to gap cursor if first media in group is selected AND its the first node in the doc', () => {
      editorInstance = editor(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media2',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media3',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      const positionOfFirstMediaNodeInGroup = 1;
      setNodeSelection(editorView, positionOfFirstMediaNodeInGroup);
      sendKeyToPm(editorView, 'ArrowUp');
      expect(editorView.state.selection instanceof GapCursorSelection).toBe(
        true,
      );
      expect(editorView.state.selection.from).toBe(0);
    });

    it('should move selection to gap cursor if first media in group is selected AND its the first node in the doc', () => {
      editorInstance = editor(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media2',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media3',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      const positionOfFirstMediaNodeInGroup = 1;
      setNodeSelection(editorView, positionOfFirstMediaNodeInGroup);
      sendKeyToPm(editorView, 'ArrowUp');
      expect(editorView.state.selection instanceof GapCursorSelection).toBe(
        true,
      );
      expect(editorView.state.selection.from).toBe(0);
    });
  });

  describe('arrow up to media single from paragraph', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to the media single node selection', () => {
      editorInstance = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'boop',
            })(),
          ),
          p('{<>}'),
        ),
      );
      const editorView = editorInstance.editorView;
      sendKeyToPm(editorView, 'ArrowUp');
      expect(editorView.state.selection instanceof NodeSelection).toBe(true);
      expect(editorView.state.selection.from).toBe(0);
    });
  });

  describe('arrow up to media single from media single right gap cursor', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to the current media singles node selection', () => {
      editorInstance = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'beep',
            })(),
          ),
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905g',
              type: 'file',
              collection: 'boop',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      setGapCursorAtPos(6, Side.RIGHT)(editorView.state, editorView.dispatch);
      sendKeyToPm(editorView, 'ArrowUp');
      expect(editorView.state.selection instanceof NodeSelection).toBe(true);
      expect(editorView.state.selection.from).toBe(3);
    });
  });

  describe('arrow up to media group from media single right gap cursor', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to the current media singles node selection', () => {
      editorInstance = editor(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media2',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media3',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
          ),
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905g',
              type: 'file',
              collection: 'boop',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      setGapCursorAtPos(8, Side.RIGHT)(editorView.state, editorView.dispatch);
      sendKeyToPm(editorView, 'ArrowUp');
      expect(editorView.state.selection instanceof NodeSelection).toBe(true);
      expect(editorView.state.selection.from).toBe(5);
    });
  });

  describe('arrow down to media single from gap cursor', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to the media single node selection', () => {
      editorInstance = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'boop',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      setGapCursorAtPos(0, Side.LEFT)(editorView.state, editorView.dispatch);
      sendKeyToPm(editorView, 'ArrowDown');
      expect(editorView.state.selection instanceof NodeSelection).toBe(true);
      expect(editorView.state.selection.from).toBe(0);
    });
  });

  describe('arrow down to media single from end of paragraph', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to the media single node selection', () => {
      editorInstance = editor(
        doc(
          p('paragraph{<>}'),
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'boop',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      sendKeyToPm(editorView, 'ArrowDown');
      expect(editorView.state.selection instanceof NodeSelection).toBe(true);
      expect(editorView.state.selection.from).toBe(11);
    });
  });

  describe('arrow down from media single right gap cursor to media group', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    it('should move selection to the left gap cursor of the media group', () => {
      editorInstance = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'boop',
            })(),
          ),
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media2',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
            media({
              id: 'media3',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileMimeType: 'pdf',
            })(),
          ),
        ),
      );
      const editorView = editorInstance.editorView;
      setGapCursorAtPos(3, Side.RIGHT)(editorView.state, editorView.dispatch);
      sendKeyToPm(editorView, 'ArrowDown');
      expect(editorView.state.selection instanceof GapCursorSelection).toBe(
        true,
      );
      expect((editorView.state.selection as GapCursorSelection).side).toBe(
        'left',
      );
      expect(editorView.state.selection.from).toBe(3);
    });
  });
});
