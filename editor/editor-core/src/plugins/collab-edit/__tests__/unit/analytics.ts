import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import featureFlagsContextPlugin from '../../../feature-flags-context';
import analyticsPlugin from '../../../analytics';
import { addSynchronyErrorAnalytics } from '../../analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  getAnalyticsEventsFromTransaction,
} from '../../../analytics';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';

describe('Collab Edit Analytics', () => {
  const createEditor = createProsemirrorEditorFactory();
  it('should add doc structured if FF is on', () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsContextPlugin, { synchronyErrorDocStructure: true }])
        .add([
          analyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEventMock(),
          },
        ]),
    });

    const tr = addSynchronyErrorAnalytics(
      editorView.state,
      editorView.state.tr,
    )(new Error('Triggered error boundary'));

    expect(getAnalyticsEventsFromTransaction(tr)[0].payload).toEqual(
      expect.objectContaining({
        action: ACTION.SYNCHRONY_ERROR,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.objectContaining({
          docStructure: expect.any(String),
        }),
      }),
    );
  });

  it('should not add doc structured if FF is off', () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsContextPlugin, { synchronyErrorDocStructure: false }])
        .add([
          analyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEventMock(),
          },
        ]),
    });

    const tr = addSynchronyErrorAnalytics(
      editorView.state,
      editorView.state.tr,
    )(new Error('Triggered error boundary'));

    expect(getAnalyticsEventsFromTransaction(tr)[0].payload).toEqual(
      expect.objectContaining({
        action: ACTION.SYNCHRONY_ERROR,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: expect.not.objectContaining({
          docStructure: expect.any(String),
        }),
      }),
    );
  });
});
