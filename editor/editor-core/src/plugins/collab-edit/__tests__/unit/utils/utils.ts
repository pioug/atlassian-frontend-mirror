import { EditorView } from 'prosemirror-view';
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
import { getPositionOfTelepointer, scrollToCollabCursor } from '../../../utils';
import { CollabParticipant } from '../../../types';
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
});
