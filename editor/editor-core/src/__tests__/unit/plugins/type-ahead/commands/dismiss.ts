import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { dismissCommand } from '../../../../../plugins/type-ahead/commands/dismiss';

describe('dismissCommand', () => {
  const createEditor = createEditorFactory();

  it('should remove active typeAheadQuery mark at selection', () => {
    const { editorView } = createEditor({
      doc: doc(
        p('Foo'),
        p(typeAheadQuery({ trigger: '/' })('/query')),
        p('Bar'),
        p(typeAheadQuery({ trigger: '/' })('/query{<>}')),
      ),
    });

    dismissCommand()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        p('Foo'),
        p(typeAheadQuery({ trigger: '/' })('/query')),
        p('Bar'),
        p('/query'),
      ),
    );
  });

  it('should do nothing without any active typeAheadQuery marks', () => {
    const { editorView } = createEditor({ doc: doc(p('/query')) });
    dismissCommand()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(p('/query')));
  });
});
