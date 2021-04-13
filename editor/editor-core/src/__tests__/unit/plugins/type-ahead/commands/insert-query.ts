import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { insertTypeAheadQuery } from '../../../../../plugins/type-ahead/commands/insert-query';

const createTypeAheadPlugin = () => ({
  pluginsOptions: {
    typeAhead: {
      trigger: '/',
    },
  },
});

describe('typeahead plugin -> commands -> insert-query', () => {
  const createEditor = createEditorFactory();

  describe('insertQuery', () => {
    it('should create a typeAheadQuery', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
        editorPlugins: [plugin],
      });
      insertTypeAheadQuery('/')(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(typeAheadQuery({ trigger: '/' })('/{<>}'))),
      );
    });

    it('should create a typeAheadQuery replacing last character', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p('/{<>}')),
        editorPlugins: [plugin],
      });
      insertTypeAheadQuery('/', true)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(typeAheadQuery({ trigger: '/' })('/{<>}'))),
      );
    });
  });
});
