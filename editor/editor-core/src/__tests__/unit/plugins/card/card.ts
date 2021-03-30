import { name } from '../../../../version.json';
import {
  doc,
  DocBuilder,
  embedCard,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { pluginKey } from '../../../../plugins/card/pm-plugins/plugin-key';

describe(name, () => {
  describe('Plugins -> Card', () => {
    const createEditor = createEditorFactory();

    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
        pluginKey,
        editorProps: {
          allowAnalyticsGASV3: true,
          UNSAFE_cards: {
            allowBlockCards: true,
            allowEmbeds: true,
            allowResizing: true,
          },
        },
      });
    };

    it('should have default attributes', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          embedCard({
            url: 'https://some/url',
            layout: 'center',
          })(),
        ),
      );

      expect(editorView.state.doc).toEqualDocument(
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
