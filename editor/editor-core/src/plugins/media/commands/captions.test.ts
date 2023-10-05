import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies\
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  insertAndSelectCaptionFromMediaSinglePos,
  selectCaptionFromMediaSinglePos,
} from './captions';

describe('Caption plugin', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder, opts = {}) =>
    createEditor({
      doc,
      ...opts,
    });

  const attachAnalyticsEvent = jest.fn().mockImplementation(() => () => {});
  const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
    attachAnalyticsEvent,
  };

  it('should insert the caption node and select it', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, allowCaptions: true },
        },
      },
    );
    insertAndSelectCaptionFromMediaSinglePos(mockEditorAnalyticsAPI)(
      0,
      editorView.state.doc.child(0),
    )(editorView.state, editorView.dispatch);
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('{<>}'),
        ),
        p('Line two'),
      ),
    );
  });

  it('should not insert the caption node when it exists already', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('test'),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, allowCaptions: true },
        },
      },
    );
    expect(
      insertAndSelectCaptionFromMediaSinglePos(mockEditorAnalyticsAPI)(
        0,
        editorView.state.doc.child(0),
      )(editorView.state, editorView.dispatch),
    ).toBeFalsy();
  });

  it('create an added analytic for captions', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, allowCaptions: true },
        },
      },
    );
    insertAndSelectCaptionFromMediaSinglePos(mockEditorAnalyticsAPI)(
      0,
      editorView.state.doc.child(0),
    )(editorView.state, editorView.dispatch);
    expect(attachAnalyticsEvent).toBeCalled();
    expect(attachAnalyticsEvent).toHaveBeenCalledWith({
      action: 'added',
      actionSubject: 'mediaSingle',
      actionSubjectId: 'caption',
      eventType: 'track',
    });
  });

  it('should move selection to an existing caption node', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('hello world'),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, allowCaptions: true },
        },
      },
    );
    selectCaptionFromMediaSinglePos(0, editorView.state.doc.child(0))(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('hello world{<>}'),
        ),
        p('Line two'),
      ),
    );
  });

  it('should not move selection to a non existing caption node', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, allowCaptions: true },
        },
      },
    );
    expect(
      selectCaptionFromMediaSinglePos(0, editorView.state.doc.child(0))(
        editorView.state,
        editorView.dispatch,
      ),
    ).toBeFalsy();
  });
});
