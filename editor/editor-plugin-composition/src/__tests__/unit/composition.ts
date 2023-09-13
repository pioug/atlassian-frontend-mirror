import type { DocBuilder } from '@atlaskit/editor-common/types';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { compositionPlugin } from '../../index';
import type { CompositionState } from '../../plugin';
import { pluginKey } from '../../pm-plugins/plugin-key';

describe('compositionPlugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>().add(compositionPlugin);
  const editor = (doc: DocBuilder) =>
    createEditor<CompositionState, typeof pluginKey, typeof preset>({
      doc,
      preset,
      pluginKey,
    });

  it('should be aware of composition input', () => {
    const { editorView, plugin } = editor(doc(p()));

    expect(plugin.getState(editorView.state).isComposing).toBe(false);
    editorView.dom.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(plugin.getState(editorView.state).isComposing).toBe(true);
    editorView.dom.dispatchEvent(
      new CompositionEvent('compositionupdate', {
        data: 'あ',
      }),
    );
    editorView.dom.dispatchEvent(new CompositionEvent('compositionend'));
    expect(plugin.getState(editorView.state).isComposing).toBe(false);
  });

  it('Zero width space is not added on compositionstart', () => {
    const { editorView } = editor(doc(p()));

    editorView.dom.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(editorView.state.doc).toEqualDocument(doc(p()));
    editorView.dom.dispatchEvent(new CompositionEvent('compositionend'));
  });

  it('(Linux only) zero width space is added on compositionstart, removed on compositionend', () => {
    // impersonate linux
    Object.defineProperty(navigator, 'userAgent', {
      value: `${navigator.userAgent} Linux`,
      configurable: true,
    });

    const { editorView } = editor(doc(p()));

    const container = document.createTextNode('');
    // @ts-ignore
    jest.spyOn(editorView.root, 'getSelection').mockImplementation(() => ({
      focusNode: container,
      focusOffset: 1,
    }));

    editorView.dom.dispatchEvent(new CompositionEvent('compositionstart'));
    expect(editorView.state.doc).toEqualDocument(doc(p(ZERO_WIDTH_SPACE)));

    insertText(editorView, 'あ');

    editorView.dom.dispatchEvent(new CompositionEvent('compositionend'));
    expect(editorView.state.doc).toEqualDocument(doc(p('あ')));
  });
});
