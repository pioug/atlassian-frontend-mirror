// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, embedCard } from '@atlaskit/editor-test-helpers/doc-builder';

describe('editor-plugin-card', () => {
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
