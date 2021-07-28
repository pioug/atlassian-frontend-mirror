import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  p,
  ul,
  li,
  doc,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  undo as pmHistoryUndo,
  redo as pmHistoryRedo,
} from 'prosemirror-history';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import undoPlugin from '../../..';
import panelPlugin from '../../../../panel';
import analyticsPlugin, {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
} from '../../../../analytics';
import listPlugin from '../../../../list';
import { pluginKey as undoPluginKey } from '../../../pm-plugins/plugin-key';
import { attachInputMeta } from '../../../attach-input-meta';
import { InputSource } from '../../../enums';

describe('change input method from undo/redo events', () => {
  let fireMock: jest.Mock;
  let createAnalyticsEvent: jest.Mock;
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(listPlugin)
        .add(panelPlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(undoPlugin),
      pluginKey: undoPluginKey,
    });

  beforeEach(() => {
    fireMock = jest.fn();
    createAnalyticsEvent = jest.fn(() => ({ fire: fireMock }));
  });

  describe('when is coming from keyboard shortcut', () => {
    it('should sent undo event with the keyboard input method', () => {
      const { editorView } = editor(
        // prettier-ignore
        doc(
        ul(
          li(
            p('AX'),
            ul(
              li(p('A1')),
              li(p('A2{<>}')),
            ),
          ),
        ),
      ),
      );

      sendKeyToPm(editorView, 'Tab');

      fireMock.mockClear();
      createAnalyticsEvent.mockClear();

      sendKeyToPm(editorView, 'Mod-z');

      expect(fireMock).toHaveBeenCalledTimes(1);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'undid',
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: ACTION.INDENTED,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          historyTriggerMethod: INPUT_METHOD.KEYBOARD,
        }),
      });
    });

    it('should sent redo event with the keyboard input method', () => {
      const { editorView } = editor(
        // prettier-ignore
        doc(
        ul(
          li(
            p('AX'),
            ul(
              li(p('A1')),
              li(p('A2{<>}')),
            ),
          ),
        ),
      ),
      );

      sendKeyToPm(editorView, 'Tab');
      sendKeyToPm(editorView, 'Mod-z');

      fireMock.mockClear();
      createAnalyticsEvent.mockClear();

      sendKeyToPm(editorView, 'Mod-y');

      expect(fireMock).toHaveBeenCalledTimes(1);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'redid',
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: ACTION.INDENTED,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          historyTriggerMethod: INPUT_METHOD.KEYBOARD,
        }),
      });
    });
  });

  describe('when is coming from other source', () => {
    it('should sent redo event with the source input method', () => {
      const { editorView } = editor(
        // prettier-ignore
        doc(
          ul(
            li(
              p('AX'),
              ul(
                li(p('A1')),
                li(p('A2{<>}')),
              ),
            ),
          ),
        ),
      );

      sendKeyToPm(editorView, 'Tab');

      attachInputMeta(InputSource.TOOLBAR)(pmHistoryUndo)(
        editorView.state,
        editorView.dispatch,
      );

      fireMock.mockClear();
      createAnalyticsEvent.mockClear();

      attachInputMeta(InputSource.TOOLBAR)(pmHistoryRedo)(
        editorView.state,
        editorView.dispatch,
      );

      expect(fireMock).toHaveBeenCalledTimes(1);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'redid',
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: ACTION.INDENTED,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          historyTriggerMethod: INPUT_METHOD.TOOLBAR,
        }),
      });
    });

    it('should sent undo event with the source input method', () => {
      const { editorView } = editor(
        // prettier-ignore
        doc(
          ul(
            li(
              p('AX'),
              ul(
                li(p('A1')),
                li(p('A2{<>}')),
              ),
            ),
          ),
        ),
      );

      sendKeyToPm(editorView, 'Tab');

      fireMock.mockClear();
      createAnalyticsEvent.mockClear();

      attachInputMeta(InputSource.TOOLBAR)(pmHistoryUndo)(
        editorView.state,
        editorView.dispatch,
      );

      expect(fireMock).toHaveBeenCalledTimes(1);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'undid',
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: ACTION.INDENTED,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          historyTriggerMethod: INPUT_METHOD.TOOLBAR,
        }),
      });
    });
  });
});
