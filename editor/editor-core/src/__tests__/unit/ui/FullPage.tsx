import React from 'react';
import type { ReactWrapper } from 'enzyme';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, extension } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';

import FullPage from '../../../ui/Appearance/FullPage';
import EditorContext from '../../../ui/EditorContext';

const mountWithContext = (node: React.ReactNode) =>
  renderWithIntl(<EditorContext>{node}</EditorContext>);

const clickWrapperId = 'click-wrapper';

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
    mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
        featureFlags={{}}
      />,
    );
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 200 });
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
    mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
        featureFlags={{}}
      />,
    );
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 200 });
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
    mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
        featureFlags={{}}
      />,
    );
    const clickWrapper = screen.getByTestId(clickWrapperId);
    fireEvent.mouseDown(clickWrapper, { clientY: 200 });
    fireEvent.mouseDown(clickWrapper, { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });

  it('should not create empty terminal paragraph when clicked inside editor', () => {
    const { editorView } = editor(doc(p('Hello world')));
    mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
        featureFlags={{}}
      />,
    );
    (editorView.dom as HTMLElement).click();
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });

  it('should set selection to end of editor content if paragraph is inserted', () => {
    const { editorView, sel } = editor(doc(p('Hello {<>}')));
    mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
        featureFlags={{}}
      />,
    );
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 300 });
    const { selection } = editorView.state;
    expect(selection.empty).toEqual(true);
    expect(selection.$to.pos).toEqual(sel + 2);
  });

  it('should set selection to end of editor content event if is already present at end', () => {
    const { editorView, sel } = editor(doc(p('Hello {<>}'), p('')));
    mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
        featureFlags={{}}
      />,
    );
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 300 });
    const { selection } = editorView.state;
    expect(selection.empty).toEqual(true);
    expect(selection.$to.pos).toEqual(sel + 2);
  });

  it('should create paragraph correctly when clicked outside and then inside the editor in sequence', () => {
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
    mountWithContext(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
        featureFlags={{}}
      />,
    );
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
    (editorView.dom as HTMLElement).click();
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
  });
});
