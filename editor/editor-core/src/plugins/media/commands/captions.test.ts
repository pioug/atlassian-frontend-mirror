import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import * as analyticsUtils from '../../analytics/utils';
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
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    insertAndSelectCaptionFromMediaSinglePos(0, editorView.state.doc.child(0))(
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
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    expect(
      insertAndSelectCaptionFromMediaSinglePos(
        0,
        editorView.state.doc.child(0),
      )(editorView.state, editorView.dispatch),
    ).toBeFalsy();
  });

  it('create an added analytic for captions', () => {
    const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
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
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    insertAndSelectCaptionFromMediaSinglePos(0, editorView.state.doc.child(0))(
      editorView.state,
      editorView.dispatch,
    );
    expect(addAnalyticsSpy).toBeCalled();
    expect(addAnalyticsSpy.mock.calls[0][2]).toEqual({
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
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
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
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
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
