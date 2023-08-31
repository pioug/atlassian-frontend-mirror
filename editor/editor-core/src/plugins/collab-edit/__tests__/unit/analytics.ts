import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import deprecatedAnalyticsPlugin from '../../../analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import { addSynchronyErrorAnalytics } from '../../analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  getAnalyticsEventsFromTransaction,
} from '../../../analytics';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

describe('Collab Edit Analytics', () => {
  const createEditor = createProsemirrorEditorFactory();
  it('should add doc structured if FF is on', () => {
    const { editorView, editorAPI } = createEditor({
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([
          analyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEventMock(),
          },
        ])
        .add([
          deprecatedAnalyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEventMock(),
          },
        ]),
    });

    const tr = addSynchronyErrorAnalytics(
      editorView.state,
      editorView.state.tr,
      { synchronyErrorDocStructure: true },
      editorAPI.analytics.actions,
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
    const { editorView, editorAPI } = createEditor({
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, { synchronyErrorDocStructure: false }])
        .add([
          analyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEventMock(),
          },
        ])
        .add([
          deprecatedAnalyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEventMock(),
          },
        ]),
    });

    const tr = addSynchronyErrorAnalytics(
      editorView.state,
      editorView.state.tr,
      { synchronyErrorDocStructure: false },
      editorAPI.analytics.actions,
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
