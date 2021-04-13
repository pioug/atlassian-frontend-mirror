import { name } from '../../../../version.json';
import { doc, embedCard } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

describe(name, () => {
  describe('Plugins -> Card', () => {
    it('should have default attributes', () => {
      const editorState = createEditorState(
        doc(
          '{<node>}',
          embedCard({
            url: 'https://some/url',
            layout: 'center',
          })(),
        ),
      );

      expect(editorState.doc).toEqualDocument(
        doc(
          '{<node>}',
          embedCard({
            url: 'https://some/url',
            layout: 'center',
            width: 100,
          })(),
        ),
      );
    });
  });
});
