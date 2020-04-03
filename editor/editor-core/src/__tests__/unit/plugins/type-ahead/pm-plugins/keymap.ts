import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { pluginKey } from '../../../../../plugins/type-ahead/pm-plugins/main';
import { createTypeAheadPlugin } from './_create-type-ahead-plugin';

describe('typeAhead keymaps', () => {
  const createEditor = createEditorFactory();

  it('enter should select current item', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/item'))),
      editorPlugins: [plugin],
    });
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(doc(p('1 selected')));
  });

  it('tab should select current item', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/item'))),
      editorPlugins: [plugin],
    });
    sendKeyToPm(editorView, 'Tab');
    expect(editorView.state.doc).toEqualDocument(doc(p('1 selected')));
  });

  it('up arrow should move selection to a previous item', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/item'))),
      editorPlugins: [plugin],
    });
    sendKeyToPm(editorView, 'Up');
    const pluginState = pluginKey.getState(editorView.state);
    expect(pluginState.currentIndex).toBe(2);
  });

  it('down arrow should move selection to a next item', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/item'))),
      editorPlugins: [plugin],
    });
    sendKeyToPm(editorView, 'Down');
    const pluginState = pluginKey.getState(editorView.state);
    expect(pluginState.currentIndex).toBe(1);
  });

  it('esc should dismiss type ahead query', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/item'))),
      editorPlugins: [plugin],
    });
    sendKeyToPm(editorView, 'Esc');
    expect(editorView.state.doc).toEqualDocument(doc(p('/item')));
  });

  it("space should select item if there's only one available", () => {
    const plugin = createTypeAheadPlugin({ getItems: () => [{ title: 1 }] });
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/item'))),
      editorPlugins: [plugin],
    });
    sendKeyToPm(editorView, 'Space');
    expect(editorView.state.doc).toEqualDocument(doc(p('1 selected')));
  });

  it('space should dismiss type ahead query if not items is available', () => {
    const plugin = createTypeAheadPlugin({ getItems: () => [] });
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/item'))),
      editorPlugins: [plugin],
    });
    sendKeyToPm(editorView, 'Space');
    expect(editorView.state.doc).toEqualDocument(doc(p('/item')));
  });
});
