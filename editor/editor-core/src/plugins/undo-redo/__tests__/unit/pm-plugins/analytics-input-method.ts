// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, ul, li, doc } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  undo as pmHistoryUndo,
  redo as pmHistoryRedo,
} from '@atlaskit/editor-prosemirror/history';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import undoPlugin from '../../..';
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { pluginKey as undoPluginKey } from '../../../pm-plugins/plugin-key';
import { attachInputMeta } from '../../../attach-input-meta';
import { InputSource } from '../../../enums';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { historyPlugin } from '@atlaskit/editor-plugin-history';

describe('change input method from undo/redo events', () => {
  let fireMock: jest.Mock;
  let createAnalyticsEvent: jest.Mock;
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(decorationsPlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(typeAheadPlugin)
        .add(listPlugin)
        .add(panelPlugin)
        .add(historyPlugin)
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
