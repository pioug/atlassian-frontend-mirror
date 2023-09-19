import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import mediaPlugin from '../../media';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import floatingToolbarPlugin from '../../floating-toolbar';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import captionPlugin from '../';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { pluginKey } from './plugin-key';
import { setTextSelection } from '../../../utils/selection';
import deprecatedAnalyticsPlugin from '../../analytics';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';

import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('Caption plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const createAnalyticsEvent = jest.fn();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      pluginKey: pluginKey,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add([deprecatedAnalyticsPlugin, { createAnalyticsEvent }])
        .add(decorationsPlugin)
        .add(editorDisabledPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(gridPlugin)
        .add(copyButtonPlugin)
        .add(floatingToolbarPlugin)
        .add(focusPlugin)
        .add([mediaPlugin, { allowMediaSingle: true, allowCaptions: true }])
        .add(captionPlugin),
    });

  it('should not remove caption when there is content', () => {
    const {
      editorView,
      refs: { movePos },
    } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('Test{<>}'),
        ),
        p('Line {movePos}two'),
      ),
    );
    setTextSelection(editorView, movePos);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('Test'),
        ),
        p('Line two'),
      ),
    );
  });

  it('should remove caption when there is no content', () => {
    const {
      editorView,
      refs: { movePos },
    } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('{<>}'),
        ),
        p('Line {movePos}two'),
      ),
    );
    setTextSelection(editorView, movePos);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('Line two'),
      ),
    );
  });

  it('should remove caption when clicking onto another caption', () => {
    const {
      editorView,
      refs: { movePos },
    } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('{<>}'),
        ),
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('second {movePos}caption'),
        ),
      ),
    );
    setTextSelection(editorView, movePos);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('second caption'),
        ),
      ),
    );
  });

  describe('analytics', () => {
    beforeEach(() => {
      createAnalyticsEvent.mockReset();
    });
    it('should fire deleted analytic when removing caption', () => {
      const {
        editorView,
        refs: { movePos },
      } = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
            caption('{<>}'),
          ),
          p('Line {movePos}two'),
        ),
      );
      setTextSelection(editorView, movePos);
      expect(createAnalyticsEvent).toBeCalledTimes(1);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'deleted',
        actionSubject: 'mediaSingle',
        actionSubjectId: 'caption',
        eventType: 'track',
      });
    });
    it('should fire edited analytic when moving away from a non empty caption', () => {
      const {
        editorView,
        refs: { movePos },
      } = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
            caption('Test{<>}'),
          ),
          p('Line {movePos}two'),
        ),
      );
      setTextSelection(editorView, movePos);
      expect(createAnalyticsEvent).toBeCalledTimes(1);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'edited',
        actionSubject: 'mediaSingle',
        actionSubjectId: 'caption',
        eventType: 'track',
      });
    });
  });
});
