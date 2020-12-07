import { createEditorFactory } from '@atlaskit/editor-test-helpers';
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { Schema } from 'prosemirror-model';
import { setNodeSelection, setTextSelection } from '../../../utils';
import { render, RenderResult } from '@testing-library/react';

const createEditorTestingLibrary = createEditorFactory(render);
const editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
  createEditorTestingLibrary({
    doc,
    editorProps: {
      media: { allowMediaSingle: true, featureFlags: { captions: true } },
    },
  }) as any & { wrapper: RenderResult };

describe('caption', () => {
  it('should render caption children', () => {
    const CAPTION_TEXT = 'this is a very cool caption';
    const {
      wrapper: { getByText },
    } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption(CAPTION_TEXT),
        ),
      ),
    );
    expect(getByText(CAPTION_TEXT)).not.toBeNull();
  });

  it("should show a placeholder if there's no children", () => {
    const {
      wrapper: { getByText },
    } = editor(
      doc(
        '{<node>}', // node selection
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
      ),
    );
    expect(getByText('Add a caption')).not.toBeNull();
  });

  it('should not show a placeholder when selecting away from media single', () => {
    const {
      wrapper: { queryByText, getByText },
      editorView,
    } = editor(
      doc(
        '{<node>}', // node selection
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('this is a random piece of text'),
      ),
    );
    expect(getByText('Add a caption')).not.toBeNull();
    setTextSelection(editorView, 13, 14);
    expect(queryByText('Add a caption')).toBeNull();
  });

  it('should show a placeholder when selecting a media single', () => {
    const {
      wrapper: { queryByText, getByText },
      editorView,
    } = editor(
      doc(
        '{node}', // node selection
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('this is a random p{<>}iece of text'),
      ),
    );
    expect(queryByText('Add a caption')).toBeNull();
    setNodeSelection(editorView, 0);
    expect(getByText('Add a caption')).not.toBeNull();
  });
});
