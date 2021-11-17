import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  media,
  mediaGroup,
  DocBuilder,
  mediaInline,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MediaAttributes } from '@atlaskit/adf-schema';
import { MediaOptions } from '../../../../../plugins/media/types';
import {
  temporaryFileId,
  testCollectionName,
} from '../../../../../__tests__/unit/plugins/media/_utils';
import { changeInlineToMediaCard, removeInlineCard } from '../../commands';

describe('mediaInline', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder, mediaPropsOverride: MediaOptions = {}) => {
    const wrapper = createEditor({
      doc,
      editorProps: {
        media: {
          allowMediaSingle: true,
          ...mediaPropsOverride,
        },
      },
    });
    return wrapper;
  };

  const attrs: MediaAttributes = {
    id: temporaryFileId,
    type: 'file',
    collection: testCollectionName,
  };

  const setup = async () => {
    const document = doc(p('{<node>}', mediaInline(attrs)()));
    const { editorView } = editor(document, {
      featureFlags: { mediaInline: true },
      allowLinking: true,
    });

    return {
      editorView,
    };
  };

  describe('removeInlineCard', () => {
    it('should remove media inline item', async () => {
      const { editorView } = await setup();
      removeInlineCard(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(doc(p('{<>}')));
    });
  });

  describe('changeInlineToMediaCard', () => {
    it('should change media inline item to media group', async () => {
      const { editorView } = await setup();
      changeInlineToMediaCard(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('{<>}'), mediaGroup(media(attrs)())),
      );
    });
  });
});
