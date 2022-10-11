import { EditorView } from 'prosemirror-view';
import { ReadonlyTransaction } from 'prosemirror-state';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { PrivateCollabEditOptions } from '../../../types';
import collabEditPlugin from '../../../index';
import analyticsPlugin from '../../../../analytics';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createTelepointers,
  getPositionOfTelepointer,
  scrollToCollabCursor,
} from '../../../utils';
import { CollabParticipant } from '../../../types';
import { getValidPos } from '../../../plugin-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const initializeCollab = (view: EditorView) =>
  view.dispatch(view.state.tr.setMeta('collabInitialised', true));

describe('collab-edit: utils', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const createEditor = createProsemirrorEditorFactory();

  const editor = (
    doc: DocBuilder,
    collabEditOptions: PrivateCollabEditOptions = {},
  ) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      // Preset doesnt support two arguments, we need to use old plugins configuration
      preset: new Preset<LightEditorPlugin>()
        .add([collabEditPlugin, collabEditOptions as PrivateCollabEditOptions])
        .add([analyticsPlugin, { createAnalyticsEvent }]),
    });
  };

  describe('getPositionOfTelepointer', () => {
    it('should return the correct position', () => {
      const sessionId = 'rick';
      const { editorView } = editor(
        doc(
          p('{<>}First Paragraph'),
          p('Paragraph'),
          p('Paragraph'),
          p('Last Paragraph'),
        ),
      );

      const decorations: Decoration[] = [];
      decorations.push(
        Decoration.widget(20, document.createElement('span'), {
          pointer: { sessionId },
          key: `telepointer-${sessionId}`,
        }),
      );
      const decorationSet = DecorationSet.create(
        editorView.state.doc,
        decorations,
      );

      const result = getPositionOfTelepointer(sessionId, decorationSet);
      expect(result).toEqual(20);
    });

    it('should return the a position that is inside the document', () => {
      const { editorView } = editor(
        doc(
          p('{<>}First Paragraph'),
          p('Paragraph'),
          p('Paragraph'),
          p('Last Paragraph'),
        ),
      );

      let tr = editorView.state.tr;
      // testing inside the document
      const posInsideDoc = getValidPos((tr as any) as ReadonlyTransaction, 12);
      expect(posInsideDoc).toEqual(12);
      expect(posInsideDoc < tr.doc.nodeSize - 2).toBe(true);
    });

    it('should return the end of the document position if the position is greater than the size of the document.', () => {
      const { editorView } = editor(
        doc(
          p('{<>}First Paragraph'),
          p('Paragraph'),
          p('Paragraph'),
          p('Last Paragraph'),
        ),
      );

      let tr = editorView.state.tr;
      // if the position is outside the document it should point to the end position of the doc.
      expect(getValidPos((tr as any) as ReadonlyTransaction, 100)).toEqual(
        tr.doc.nodeSize - 2,
      );
    });
  });

  describe('scrollToCollabCursor', () => {
    it('should change the users selection to the correct position', () => {
      const { editorView } = editor(
        doc(
          p('{<>}First Paragraph'),
          p('Paragraph'),
          p('Paragraph'),
          p('Last Paragraph'),
        ),
      );

      const participants: CollabParticipant[] = [
        {
          sessionId: 'morty',
          name: 'Morty Smith',
          avatar: 'testData',
          lastActive: 0,
          email: 'testData',
          cursorPos: 1,
        },
        {
          sessionId: 'rick',
          name: 'Rick Sanchez',
          avatar: 'testData',
          lastActive: 0,
          email: 'testData',
          cursorPos: 20,
        },
      ];

      initializeCollab(editorView);
      scrollToCollabCursor(editorView, participants, 'morty', 1);

      const { from, to } = editorView.state.selection;
      expect({ from, to }).toEqual({
        from: 20,
        to: 20,
      });
    });

    it('should fire analytics event', () => {
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'matched',
        actionSubject: 'selection',
        eventType: 'track',
      });
    });
  });

  describe('createTelepointers', () => {
    it('should add ZERO_WIDTH_JOINER character before and after telepointer', () => {
      const decorationSet = createTelepointers(20, 25, 'temp', false, 'data');
      expect(escape((decorationSet[0] as any).type.toDOM.outerHTML)).toContain(
        'u200D',
      );
      expect(escape((decorationSet[2] as any).type.toDOM.outerHTML)).toContain(
        'u200D',
      );
    });
  });
});
