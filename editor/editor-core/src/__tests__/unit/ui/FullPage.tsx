import React from 'react';
import { ReactWrapper } from 'enzyme';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  p,
  extension,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import FullPage from '../../../ui/Appearance/FullPage';
import EditorContext from '../../../ui/EditorContext';

const mountWithContext = (node: React.ReactNode) =>
  mountWithIntl(<EditorContext>{node}</EditorContext>);

describe('full page editor', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowExtension: true },
    });
  let fullPage: ReactWrapper<any, unknown, EditorContext> | undefined;

  afterAll(() => {
    if (fullPage) {
      fullPage.unmount();
      fullPage = undefined;
    }
  });

  it('should create empty terminal empty paragraph when clicked outside editor', () => {
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
    fullPage = mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
  });

  it('should create empty terminal empty paragraph when clicked outside editor even if last block is extension', () => {
    const { editorView } = editor(
      doc(
        p('Hello world'),
        extension({
          extensionKey: '123',
          extensionType: 'BLOCK',
          localId: 'testId',
        })(),
      ),
    );
    fullPage = mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(
        p('Hello world'),
        extension({
          extensionKey: '123',
          extensionType: 'BLOCK',
          localId: 'testId',
        })(),
        p(''),
      ),
    );
  });

  it('should not create empty terminal empty paragraph if it is already present at end', () => {
    const { editorView } = editor(doc(p('Hello world'), p('')));
    fullPage = mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 })
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });

  it('should not create empty terminal paragraph when clicked inside editor', () => {
    const { editorView } = editor(doc(p('Hello world')));
    fullPage = mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    (editorView.dom as HTMLElement).click();
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });

  it('should set selection to end of editor content if paragraph is inserted', () => {
    const { editorView, sel } = editor(doc(p('Hello {<>}')));
    fullPage = mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 300 });
    const { selection } = editorView.state;
    expect(selection.empty).toEqual(true);
    expect(selection.$to.pos).toEqual(sel + 2);
  });

  it('should set selection to end of editor content event if is already present at end', () => {
    const { editorView, sel } = editor(doc(p('Hello {<>}'), p('')));
    fullPage = mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 300 });
    const { selection } = editorView.state;
    expect(selection.empty).toEqual(true);
    expect(selection.$to.pos).toEqual(sel + 2);
  });

  it('should create paragraph correctly when clicked outside and then inside the editor in sequence', () => {
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
    fullPage = mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
    (editorView.dom as HTMLElement).click();
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
    fullPage
      .findWhere((elm) => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
  });
});
